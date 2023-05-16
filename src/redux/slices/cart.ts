import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import intersectionWith from 'lodash/intersectionWith';
import { ICartItem, ICartState, ICartResponse } from 'src/@types/book';
import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import differenceWith from 'lodash/differenceWith';
import cartApi from 'src/api-client/cart';

// ----------------------------------------------------------------------

const initialState: ICartState = {
  products: [],
  total: 0,
  totalItems: 0,
  selected: [],
};

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<number[]>) {
      state.selected = action.payload;
    },

    setCart(state, action: PayloadAction<ICartItem[]>) {
      state.products = action.payload;
    },

    getCart(state) {
      state.totalItems = sumBy(state.products, 'quantity');
      state.total = sumBy(state.products, (p) => p.price * p.quantity);
    },

    addToCart(state, action: PayloadAction<ICartItem>) {
      const addProduct = action.payload;
      const findP = state.products.find((p) => p.id === addProduct.id);

      if (findP) {
        findP.quantity = Math.min(addProduct.available, findP.quantity + addProduct.quantity);
      } else {
        state.products.push(addProduct);
      }

      state.products = uniqBy(state.products, 'id');
    },

    increaseQuantity(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const findP = state.products.find((p) => p.id === productId);
      if (findP) {
        findP.quantity = Math.min(findP.available, findP.quantity + 1);
      }
    },

    decreaseQuantity(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const findP = state.products.find((p) => p.id === productId);
      if (findP) {
        findP.quantity = Math.max(1, findP.quantity - 1);
      }
    },

    deleteCart(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },

    finishOrder(state) {
      const rest = differenceWith(state.products, state.selected, (a, b) => a.id === b);
      state.products = rest;
      state.selected = [];
      state.totalItems = sumBy(rest, 'quantity');
      state.total = sumBy(rest, (p) => p.price * p.quantity);
    },

    resetCart(state) {
      state.products = [];
      state.total = 0;
      state.totalItems = 0;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelected, getCart, resetCart, finishOrder } = slice.actions;

// ----------------------------------------------------------------------

export function syncCart(_reduxCart: ICartItem[]) {
  return async (dispatch: Dispatch) => {
    try {
      const cartDb = await cartApi.get();

      const idsDb = cartDb.map((e) => e.id);

      const reduxCart = _reduxCart.filter((e) => !e.cartId || idsDb.includes(e.cartId));

      const matchNoUpdate: ICartResponse[] = [];
      const update: { bookId: number; quantity: number }[] = [];

      const onlyDb = differenceWith(cartDb, reduxCart, (db, local) => db.book.id === local.id);

      intersectionWith(cartDb, reduxCart, (db, local) => {
        if (db.book.id !== local.id) return false;
        if (local.quantity > db.quantity)
          // > - Lấy max | !== - cộng dồn
          update.push({
            bookId: local.id,
            quantity: Math.abs(local.quantity - db.quantity),
          });
        else {
          matchNoUpdate.push(db);
        }
        return true;
      });

      differenceWith(reduxCart, cartDb, (local, db) => db.book.id === local.id).forEach((item) => {
        update.push({ bookId: item.id, quantity: item.quantity });
      });

      if (update.length !== 0) {
        const res = await cartApi.updateMultiple(update);
        dispatch(
          slice.actions.setCart(
            [...matchNoUpdate, ...res, ...onlyDb].map((e) => ({
              ...e.book,
              cartId: e.id,
              available: e.book.quantity,
              quantity: e.quantity,
            }))
          )
        );
      } else {
        dispatch(
          slice.actions.setCart(
            [...matchNoUpdate, ...onlyDb].map((e) => ({
              ...e.book,
              cartId: e.id,
              available: e.book.quantity,
              quantity: e.quantity,
            }))
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteCart(id: number, cart: ICartItem[], isLogged: boolean) {
  return async (dispatch: Dispatch) => {
    try {
      if (isLogged) cartApi.remove(id);
      const _cart = cart.map((e) => ({ ...e })).filter((p) => p.id !== id);
      dispatch(slice.actions.setCart(_cart));
    } catch (error) {
      console.log(error);
    }
  };
}

export function addToCart(product: ICartItem, cart: ICartItem[], isLogged: boolean) {
  return async (dispatch: Dispatch) => {
    try {
      const _cart = cart.map((e) => ({ ...e }));

      const findP = _cart.find((p) => p.id === product.id);

      if (findP) {
        if (isLogged) cartApi.update({ bookId: findP.id, quantity: product.quantity });
        findP.quantity = Math.min(product.available, findP.quantity + product.quantity);
      } else {
        if (isLogged) cartApi.update({ bookId: product.id, quantity: product.quantity });
        _cart.push(product);
      }

      dispatch(slice.actions.setCart(_cart));
    } catch (error) {
      console.log(error);
    }
  };
}

export function increaseQuantity(id: number, cart: ICartItem[], isLogged: boolean) {
  return async (dispatch: Dispatch) => {
    try {
      const _cart = cart.map((e) => ({ ...e }));
      const findP = _cart.find((p) => p.id === id);
      if (findP) {
        if (isLogged) cartApi.update({ bookId: id, quantity: 1 });
        findP.quantity = Math.min(findP.available, findP.quantity + 1);
      }
      dispatch(slice.actions.setCart(_cart));
    } catch (error) {
      console.log(error);
    }
  };
}

export function decreaseQuantity(id: number, cart: ICartItem[], isLogged: boolean) {
  return async (dispatch: Dispatch) => {
    try {
      const _cart = cart.map((e) => ({ ...e }));
      const findP = _cart.find((p) => p.id === id);
      if (findP) {
        if (isLogged) cartApi.update({ bookId: id, quantity: -1 });
        findP.quantity = Math.max(1, findP.quantity - 1);
      }
      dispatch(slice.actions.setCart(_cart));
    } catch (error) {
      console.log(error);
    }
  };
}

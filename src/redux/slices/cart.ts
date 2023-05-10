import uniqBy from 'lodash/uniqBy';
import { ICartItem, ICartState } from 'src/@types/book';
import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import sumBy from 'lodash/sumBy';
import differenceWith from 'lodash/differenceWith';
import cartApi from 'src/api-client/cart';
import compact from 'lodash/compact';

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

export function syncCart(localCart: ICartItem[]) {
  return async (dispatch: Dispatch) => {
    try {
      const res = await cartApi.get();

      // const itemNoLocal = differenceWith(res, localCart, (d, l) => d.book.id === l.id).map((e) => ({
      //   bookId: e.book.id,
      //   quantity: e.quantity,
      // }));

      const itemNoDb = differenceWith(localCart, res, (l, d) => l.id === d.book.id).map((e) => ({
        bookId: e.id,
        quantity: e.quantity,
      }));

      const noMatchQty = localCart.map((item) => {
        const f = res.find((e) => e.book.id === item.id);
        if (f && item.quantity !== f.quantity)
          return { bookId: item.id, quantity: Math.abs(item.quantity - f.quantity) };

        return null;
      });

      const updateItem = [...itemNoDb, ...compact(noMatchQty)];
      if (updateItem.length !== 0) {
        console.log(updateItem);
        await cartApi.updateMultiple(updateItem);
        const resAfterUpdate = await cartApi.get();

        dispatch(
          slice.actions.setCart(
            resAfterUpdate.map((e) => ({
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
            res.map((e) => ({
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

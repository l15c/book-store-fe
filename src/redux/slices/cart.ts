import uniqBy from 'lodash/uniqBy';
import { ICartItem, ICartState } from 'src/@types/book';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import sumBy from 'lodash/sumBy';
import differenceBy from 'lodash/differenceBy';

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
    startOrder(state, action: PayloadAction<ICartItem[]>) {
      state.selected = action.payload;
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
      const rest = differenceBy(state.products, state.selected, 'id');
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
export const {
  startOrder,
  getCart,
  addToCart,
  resetCart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

import uniqBy from 'lodash/uniqBy';
import { ICartItem, ICartState } from 'src/@types/book';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import sumBy from 'lodash/sumBy';

// ----------------------------------------------------------------------

const initialState: ICartState = {
  products: [],
  total: 0,
  totalItems: 0,
};

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getCart(state) {
      state.totalItems = sumBy(state.products, 'quantity');
      state.total = sumBy(state.products, (p) => p.price * p.quantity);
    },

    addToCart(state, action: PayloadAction<ICartItem>) {
      const addProduct = action.payload;
      const findP = state.products.find((p) => p.id === addProduct.id);

      if (findP) {
        findP.quantity = Math.min(findP.available, findP.quantity + 1);
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
export const { getCart, addToCart, resetCart, deleteCart, increaseQuantity, decreaseQuantity } =
  slice.actions;

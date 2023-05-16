import { createSlice } from '@reduxjs/toolkit';
import { ICheckoutState } from 'src/@types/book';

// ----------------------------------------------------------------------

const initialState: ICheckoutState = {
  activeStep: 0,
  discount: 0,
  shipping: 0,
  billing: null,
};

const slice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    backStep(state) {
      state.activeStep -= 1;
    },

    nextStep(state) {
      state.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.activeStep = step;
    },

    createBilling(state, action) {
      state.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.discount = discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.shipping = Math.round(shipping / 1000) * 1000;
    },

    resetCheckout(state) {
      state.discount = 0;
      state.shipping = 0;
      state.billing = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  gotoStep,
  backStep,
  nextStep,
  resetCheckout,
  createBilling,
  applyShipping,
  applyDiscount,
} = slice.actions;

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import calendarReducer from './slices/calendar';
import cartReducer from './slices/cart';
import chatReducer from './slices/chat';
import checkoutReducer from './slices/checkout';
import kanbanReducer from './slices/kanban';
import mailReducer from './slices/mail';

// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const cartPersistConfig = {
  key: 'cart',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['products'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  checkout: checkoutReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
});

export default rootReducer;

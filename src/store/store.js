import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './slice/counterSlice.js';
import accountSlice from './slice/accountSlice.js';
import themeSlice from './slice/themeSlice.js';
import cartSlice from './slice/cartSlice.js';
import favoritesSlice from './slice/favoritesSlice.js';
import uiSlice from './slice/uiSlice';

export default configureStore({
  reducer: {
    account: accountSlice,
    counter: counterSlice,
    theme: themeSlice,
    cart: cartSlice,
    favorites: favoritesSlice,
    ui: uiSlice,
  },
});

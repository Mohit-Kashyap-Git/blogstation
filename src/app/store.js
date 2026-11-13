import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice'
import authReducer from '../features/auth/authSlice'
import toastReducer from '../features/toast/toastSlice' 

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    toast: toastReducer,
  },
})
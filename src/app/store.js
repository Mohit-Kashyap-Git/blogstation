import { configureStore } from '@reduxjs/toolkit'

// Placeholder reducer so the store is valid.
// Replaced by real slices (auth, theme, etc.) in later phases.
export const store = configureStore({
  reducer: {
    app: (state = {}) => state,
  },
})
import { createSlice, nanoid } from '@reduxjs/toolkit'

const MAX_TOASTS = 3 // oldest is dropped when a fourth arrives

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    addToast: {
      reducer(state, action) {
        state.items.push(action.payload)
        if (state.items.length > MAX_TOASTS) state.items.shift()
      },
      // `prepare` lets callers write addToast('success', 'Saved.'),
      // and generates the id here, so the reducer stays pure.
      prepare(tone, message) {
        return { payload: { id: nanoid(), tone, message } }
      },
    },
    removeToast(state, action) {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export const selectToasts = (state) => state.toast.items
export default toastSlice.reducer
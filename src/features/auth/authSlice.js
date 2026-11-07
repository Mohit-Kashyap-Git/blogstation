import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authService from '../../services/authService'
import { getAuthErrorMessage } from '../../utils/authErrors'

// Wraps a service call so every thunk handles errors the same way.
function createAuthThunk(type, serviceFn) {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await serviceFn(arg)
    } catch (error) {
      return rejectWithValue(getAuthErrorMessage(error))
    }
  })
}

export const initializeAuth = createAuthThunk('auth/initialize', authService.getCurrentUser)
export const loginUser = createAuthThunk('auth/login', authService.login)
export const registerUser = createAuthThunk('auth/register', authService.register)
export const logoutUser = createAuthThunk('auth/logout', authService.logout)

const initialState = {
  user: null,
  isInitializing: true, // true until the first session check finishes
  isSubmitting: false, // true while login/register is in flight
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isInitializing = false
      })
      .addCase(initializeAuth.rejected, (state) => {
        // Network or server problem: treat as logged out so the app still loads.
        state.user = null
        state.isInitializing = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload
      })

    // Login and register behave the same way.
    ;[loginUser, registerUser].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isSubmitting = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isSubmitting = false
          state.user = action.payload
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isSubmitting = false
          state.error = action.payload
        })
    })
  },
})

export const { clearAuthError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.user !== null
export const selectIsInitializing = (state) => state.auth.isInitializing
export const selectIsSubmitting = (state) => state.auth.isSubmitting
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
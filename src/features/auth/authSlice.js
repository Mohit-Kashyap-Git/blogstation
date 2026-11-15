import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authService from '../../services/authService'
import { getAuthErrorMessage } from '../../utils/authErrors'
import { getErrorMessage } from '../../utils/appwriteErrors'

// Wraps a service call so every thunk handles errors the same way.
// On failure, the thunk rejects with a user-friendly message string,
// which callers can read with `await dispatch(thunk()).unwrap()`.
function createAuthThunk(type, serviceFn, getMessage = getAuthErrorMessage) {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await serviceFn(arg)
    } catch (error) {
      return rejectWithValue(getMessage(error))
    }
  })
}

export const initializeAuth = createAuthThunk('auth/initialize', authService.getCurrentUser)
export const loginUser = createAuthThunk('auth/login', authService.login)
export const registerUser = createAuthThunk('auth/register', authService.register)
export const logoutUser = createAuthThunk('auth/logout', authService.logout)
export const updateProfileName = createAuthThunk('auth/updateName', authService.updateName, getErrorMessage)

const initialState = {
  user: null,
  isInitializing: true, // true until the first session check finishes
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when we've confirmed the session is gone. Route guards do the redirect.
    sessionExpired(state) {
      state.user = null
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
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfileName.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { sessionExpired } = authSlice.actions
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.user !== null
export const selectIsInitializing = (state) => state.auth.isInitializing

export default authSlice.reducer
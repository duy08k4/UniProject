import { configureStore } from '@reduxjs/toolkit'

// Reducer
import authReducer from './reducers/authSlice.reducer'
import adminReducer from './reducers/adminSlice.reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
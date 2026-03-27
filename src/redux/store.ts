import { configureStore } from '@reduxjs/toolkit'

// Reducer
import authReducer from './reducers/authSlice.reducer'
import adminReducer from './reducers/adminSlice.reducer'
import classReducer from './reducers/classSlice.reducer'
import globalReducer from './reducers/global.reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    class: classReducer,
    stateGlobal: globalReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
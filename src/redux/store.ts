import { configureStore } from '@reduxjs/toolkit'

// Reducer
import authReducer from './reducers/authSlice.reducer'
import adminReducer from './reducers/adminSlice.reducer'
import classReducer from './reducers/classSlice.reducer'
import globalReducer from './reducers/global.reducer'
import progressReducer from './reducers/progressSlice.reducer'
import formReducer from './reducers/formSlice.reducer'
import notificationReducer from './reducers/notification.reducer'
import scoreFormReducer from './reducers/scoreformSlice.reducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    class: classReducer,
    progress: progressReducer,
    notification: notificationReducer,
    form: formReducer,
    stateGlobal: globalReducer,
    scoreForm: scoreFormReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import { configureStore, combineReducers } from '@reduxjs/toolkit'

// Reducer
import authReducer from './reducers/authSlice.reducer'
import classReducer from './reducers/classSlice.reducer'
import globalReducer from './reducers/global.reducer'
import progressReducer from './reducers/progressSlice.reducer'
import formReducer from './reducers/formSlice.reducer'
import notificationReducer from './reducers/notification.reducer'
import scoreFormReducer from './reducers/scoreformSlice.reducer'
import submissionReducer from './reducers/submissionSlice.reducer'
import thesisReducer from './reducers/thesisSlice.reducer'
import topicsReducer from './reducers/topicsSlice.reducer'

const appReducer = combineReducers({
  auth: authReducer,
  class: classReducer,
  progress: progressReducer,
  notification: notificationReducer,
  form: formReducer,
  submission: submissionReducer,
  stateGlobal: globalReducer,
  scoreForm: scoreFormReducer,
  thesis: thesisReducer,
  topics: topicsReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
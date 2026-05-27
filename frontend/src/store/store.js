import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import questReducer from './slices/questSlice'
import courseReducer from './slices/courseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    quest: questReducer,
    courses: courseReducer,
  },
})


import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../lib/slice/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

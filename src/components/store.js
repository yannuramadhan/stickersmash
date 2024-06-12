import { configureStore } from "@reduxjs/toolkit";
import authReducers from '../components/reducer.js'

export default configureStore({
    reducer: {
        auth: authReducers,
    }
})
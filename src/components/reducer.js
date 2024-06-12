import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-community/async-storage';


const initialState = {
    isuser: AsyncStorage.getItem("user") || null,
}

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        
        setisUser: (state, action) => {
            AsyncStorage.setItem("user", action.payload)
            state.isuser = action.payload
        },
    }
})
export const {
    setisUser
} = AuthSlice.actions
export const selectisUser = (state) => state.auth.isuser
export default AuthSlice.reducer
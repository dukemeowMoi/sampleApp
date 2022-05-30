import { configureStore } from '@reduxjs/toolkit'
import appReducer from "../Slicer/AppSlice";

export default configureStore({
    reducer: appReducer 
})
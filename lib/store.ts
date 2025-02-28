
// store.js
import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '@/reducers/productsReducer' // example

export const store = configureStore({
    reducer: {
        products: productsReducer,
        // add more slices/reducers here
    },
    // thunk is included by default, so no need to add it manually
})

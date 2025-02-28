// actions/productsActions.js
import { getProducts } from '@/lib/api';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const fetchProducts = (query:any) => async (dispatch:any) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
        const data = await getProducts({ search: query });
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
    } catch (error:any) {
        dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
};

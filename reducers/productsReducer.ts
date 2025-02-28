// reducers/productsReducer.js
import {
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
} from '@/actions/productsActions';

const initialState = {
    loading: false,
    products: [],
    error: null,
};

const productsReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case FETCH_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, loading: false, products: action.payload };
        case FETCH_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default productsReducer;

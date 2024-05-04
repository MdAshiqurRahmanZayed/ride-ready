// import {
//      configureStore
// } from '@reduxjs/toolkit';
import {
     createStore,
     applyMiddleware
} from "redux";

import {
     thunk
} from 'redux-thunk';
import reducer from './reducers';

export const store = createStore(reducer, applyMiddleware(thunk));

export default store;
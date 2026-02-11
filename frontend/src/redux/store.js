import {
     createStore,
     applyMiddleware
} from "redux";
import {
     persistStore,
     persistReducer
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import {
     thunk
} from 'redux-thunk';
import reducer from './reducers';

const persistConfig = {
     key: "root",
     storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(
     persistedReducer,
     applyMiddleware(thunk)
);

export const persistor = persistStore(store);

const storeConfig = {
     store,
     persistor
};

export default storeConfig;

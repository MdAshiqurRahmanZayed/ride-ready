import './App.css';
import Main from './components/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'; 
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; // Import store and persistor
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <ToastContainer />

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Main/>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </React.Fragment>
    </div>
  );
}

export default App;

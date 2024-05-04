import './App.css';
import Main from './components/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Provider
} from 'react-redux'; 
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import {
  ToastContainer
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
      <React.Fragment>
          <ToastContainer />

        <Provider store={store}>
          <BrowserRouter>
            <Main/>
          </BrowserRouter>
       </Provider>
      </React.Fragment>
    </div>
  );
}

export default App;

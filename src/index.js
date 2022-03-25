import React from 'react';
import ReactDOM from 'react-dom';
import './globalStyles.css';
import reportWebVitals from './reportWebVitals';
import {createStore, StoreProvider} from "easy-peasy";
import Router from './Router';

// easy-peasy (maybe not even needed)
const store = {};

ReactDOM.render(
  <React.StrictMode>
      <StoreProvider store={createStore(store)}>
          <Router />
      </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

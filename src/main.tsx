import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "react-quill/dist/quill.snow.css";
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import {store} from './store';
import './i18n';
import { registerSW } from "virtual:pwa-register";


registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

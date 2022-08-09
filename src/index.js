import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//시작하자마자 user정보 가져오기 위해서 index.js에서 작업해주기

import { store } from './app/store';
import { Provider } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

store.dispatch(fetchUsers());


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);


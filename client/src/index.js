import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './components/app';
import { ToastContainer } from 'react-toastify';
import ErrorBoundry from './components/error-boundry';
import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundry>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
      </ErrorBoundry>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

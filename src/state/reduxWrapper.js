import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '.';
import thunk from 'redux-thunk';

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default ({ element }) => (
  <Provider store={store}>{element}</Provider>
);

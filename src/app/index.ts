import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { store } from './store';

setTimeout(async () => {
  await store.config();
  const root = document.querySelector('div.root') as HTMLElement;
  ReactDOM.createRoot(root).render(React.createElement(App));
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

const root = document.querySelector('div.root') as HTMLElement;
ReactDOM.createRoot(root).render(React.createElement(App));

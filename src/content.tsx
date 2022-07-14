import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './content/app';

let init = false;

function render() {
  const root = document.createElement('div');
  root.classList.add('jam');
  document.body.append(root);
  ReactDOM.createRoot(root).render(<App />);
  init = true;
}

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
  if (message.type === 'click' && !init) {
    render();
    reply({ success: true });
  } else {
    reply({});
  }
});

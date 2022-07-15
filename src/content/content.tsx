import './content.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

let init = false;

function render() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.7.1/ace.js';
  document.body.appendChild(script);

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

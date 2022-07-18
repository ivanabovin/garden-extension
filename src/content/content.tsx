import './content.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

const root = document.createElement('div');
root.classList.add('jam');

let init = false;
let show = false;

function sendShowEvent() {
  void chrome.runtime.sendMessage({ type: 'show', show });
}

function render() {
  document.body.append(root);
  ReactDOM.createRoot(root).render(<App />);
  init = true;
  show = true;
  sendShowEvent();
}

function toggleShow() {
  show = !show;
  root.style.display = show ? 'block' : 'none';
  sendShowEvent();
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'click') {
    if (!init) render();
    else toggleShow();
  }
  return true;
});

if (localStorage.getItem('development') === 'true') render();

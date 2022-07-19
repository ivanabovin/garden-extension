import ReactDOM from 'react-dom/client';
import { event } from './event';
import { App } from './app';
import React from 'react';

function createFrame() {
  const frame = document.createElement('iframe');
  frame.style.zIndex = '9999';
  frame.style.display = 'block';
  frame.style.position = 'fixed';
  frame.style.top = '0';
  frame.style.right = '0';
  frame.style.width = '400px';
  frame.style.height = '100vh';
  frame.style.background = '#ffffff';
  return frame;
}

function onClickedExtension(frame: HTMLIFrameElement) {
  let show = frame.style.display != 'none';
  show = !show;
  frame.style.display = show ? 'block' : 'none';
  event.emit('onShowContent', show);
}

function render() {
  const frame = createFrame();
  document.body.append(frame);
  const doc = frame.contentDocument!;
  const style = doc.createElement('style');
  style.innerText = '.root { background: lightyellow; }';
  doc.head.append(style);
  const root = document.createElement('div');
  root.classList.add('root');
  doc.body.append(root);
  ReactDOM.createRoot(root).render(React.createElement(App));
  event.on('onClickedExtension', () => onClickedExtension(frame));
  event.emit('onShowContent', true);
}

let mount = false;
event.on('onClickedExtension', function () {
  if (!mount) {
    render();
    mount = true;
  }
});

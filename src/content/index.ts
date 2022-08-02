import { frame } from './frame';

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'click') frame.toggle();
});

if (localStorage.getItem('development') === 'true') frame.toggle();

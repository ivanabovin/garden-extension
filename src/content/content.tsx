import './content.css';
import './react';
import './store';
import { event } from './event';

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'click') {
    event.emit('onClickedExtension');
  }
  return true;
});

event.on('onShowContent', function (show) {
  void chrome.runtime.sendMessage({ type: 'show', show });
});

if (localStorage.getItem('development') === 'true') {
  event.emit('onClickedExtension');
}

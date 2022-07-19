import './content.css';
import './store';
import { event } from './event';

// @ts-ignore
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  _renderers: {},
  supportsFiber: true,
  inject: () => ({}),
  onCommitFiberRoot: () => ({}),
  onCommitFiberUnmount: () => ({}),
};

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'click') {
    event.emit('onClickedExtension');
  }
  return true;
});

event.on('onShowContent', function (show) {
  void chrome.runtime.sendMessage({ type: 'show', show });
});


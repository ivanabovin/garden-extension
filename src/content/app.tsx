import React from 'react';
import ReactDOM from 'react-dom/client';
import { observer } from 'mobx-react-lite';
import { store } from './store';

export const App = observer(() => {
  const display = store.show ? 'block' : 'none';
  return <div className="frame" style={{ display }}>
    - app -
  </div>;
});

export function render() {
  const root = document.createElement('div');
  root.classList.add('jam');
  document.body.append(root);
  ReactDOM.createRoot(root).render(<App />);
}

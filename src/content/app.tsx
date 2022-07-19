import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

export function App() {
  return <div className="frame">
    - app -
  </div>;
}

App.render = function () {
  const root = document.createElement('div');
  root.classList.add('jam');
  document.body.append(root);
  ReactDOM.createRoot(root).render(<App />);
};

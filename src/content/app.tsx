import React, { useEffect, useMemo } from 'react';

export function App() {
  useMemo(() => {
    console.log('m');
  }, []);
  useEffect(() => {
    console.log('e');
  }, []);
  console.log('-');
  return <div className="frame">
    - app -
  </div>;
}

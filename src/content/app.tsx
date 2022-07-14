import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';

export function App() {
  const code = `
function foo(items, nada) {
  for (var i=0; i<items.length; i++) {
      alert(items[i] + "juhu\\n");
  }\t// Real Tab.
}`.substring(1);

  const options = {
    showGutter: false,
  };
  return <div className="editor" style={{ position: 'fixed', left: 0, top: 0, zIndex: 999 }}>
    <AceEditor
      mode="javascript"
      theme="tomorrow"
      value={code}
      setOptions={options}
    />
  </div>;
}

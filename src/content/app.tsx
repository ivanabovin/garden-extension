import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';

export function App() {
  const code = `
function foo(items, nada) {
  for (var i=0; i<items.length; i++) {
      alert(items[i] + "xxx\\n");
  }\t// Real Tab.
}`.substring(1);

  const options = {
    showGutter: false,
  };
  return <div className="editor">
    <AceEditor
      mode="javascript"
      theme="tomorrow"
      value={code}
      setOptions={options}
      width="320px"
      height="480px"
    />
  </div>;
}

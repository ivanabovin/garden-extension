import React from 'react';
import { observer } from 'mobx-react-lite';
import { Language, store } from './store';
import { toJson } from './util/json';

export const Lang = observer(({ lang }: { lang: Language }) => {
  return <div>
    <code>{lang.name}: '{lang.text}'</code>
  </div>;
});

export const App = observer(() => {
  console.log('store:', toJson(store));
  return <div className="app">
    <h4>Languages</h4>
    <div>
      {store.languages.map(lang => <Lang key={lang.name} lang={lang} />)}
    </div>
  </div>;
});

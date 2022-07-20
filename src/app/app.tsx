import React, { ChangeEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Language, store } from './store';
import { toJson } from './util/json';
import { runInAction } from 'mobx';

export const Lang = observer(({ lang }: { lang: Language }) => {
  return <div>
    <code>{lang.code}: '{lang.title}'</code>
  </div>;
});

export const App = observer(() => {
  console.log('store:', toJson(store));

  const onChangeLang = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    runInAction(() => store.lang = Language.take(code));
  }, []);

  return <div className="app">
    <h4>Jam</h4>
    <div>
      <label>
        <span>Language</span>
        <select value={store.lang.code} onChange={e => onChangeLang(e)}>
          {Language.all.map(lang => <option key={lang.code} value={lang.code}>{lang.title}</option>)}
        </select>
        <input/>
        <button>button</button>
      </label>
    </div>
    <div>
      {store.languages.map(lang => <Lang key={lang.code} lang={lang} />)}
    </div>
  </div>;
});

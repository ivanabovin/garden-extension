import React, { ChangeEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Language, store, Translation } from './store';
import { runInAction } from 'mobx';
import { api } from './api';

export const TextBox = observer(() => {
  const onChangeLang = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    runInAction(() => store.lang = code);
  }, []);
  const onChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    runInAction(() => store.text = text);
  }, []);
  const onClickTranslate = useCallback(() => {
    api.translate();
  }, []);
  const language = Language.take(store.lang);
  return <div className="row">
    <select className="button" style={{ fontWeight: 600 }}
      value={store.lang} title={language.title} onChange={onChangeLang}>
      {Language.all.map(lang => <option key={lang.code} value={lang.code} title={lang.title}>{lang.code}</option>)}
    </select>
    <input value={store.text} onChange={onChangeText} />
    <button disabled={store.busy} onClick={onClickTranslate}>Translate</button>
  </div>;
});

export const TranslationBox = observer(({ translation }: { translation: Translation }) => {
  const onChangeLang = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    runInAction(() => translation.lang = code);
  }, []);
  const onChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    runInAction(() => translation.text = text);
  }, []);
  const onClickDelete = useCallback(() => {
    store.removeTranslation(translation);
  }, []);
  const onClickRestore = useCallback(() => {
    runInAction(() => translation.removed = false);
  }, []);
  const language = Language.take(translation.lang);
  const removed = translation.removed ? 'removed' : '';
  return <div className={'row translation ' + removed} style={{ marginTop: 8 }}>
    <select className="button" style={{ fontWeight: 600 }}
      value={translation.lang} title={language.title} onChange={onChangeLang}>
      {Language.all.map(lang => <option key={lang.code} value={lang.code} title={lang.title}>{lang.code}</option>)}
    </select>
    <input value={translation.text} onChange={onChangeText} />
    <button className="link" title="Remove" onClick={onClickDelete}>&#x2716;</button>
    {translation.removed && <button className="link" title="Restore" onClick={onClickRestore}>&#x25cb;</button>}
  </div>;
});

export const App = observer(() => {
  const onClickAdd = useCallback(() => {
    store.addTranslation();
  }, []);
  return <div className="app">
    <h4>Jam</h4>
    <div>
      <TextBox />
    </div>
    <div className="row">
      <strong>Translations</strong>
      <button className="link" onClick={onClickAdd}>Add</button>
    </div>
    <div>
      {store.translations.map(translation => <TranslationBox key={translation.$id} translation={translation} />)}
    </div>
  </div>;
});

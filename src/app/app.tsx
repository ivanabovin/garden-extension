import React, { ChangeEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Language, store, Translation } from './store';
import { runInAction } from 'mobx';
import { api } from './api';
import cn from 'classnames';

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
  return <div className="text-box">
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
  const onClickDelete = useCallback(() => {
    store.removeTranslation(translation);
  }, []);
  const onClickRestore = useCallback(() => {
    runInAction(() => translation.disabled = false);
  }, []);
  const language = Language.take(translation.lang);
  const { disabled } = translation;
  return <div className={cn('translation-box', disabled && 'disabled')}>
    <select className="button lang" value={translation.lang} title={language.title} onChange={onChangeLang}>
      {Language.all.map(lang => <option key={lang.code} value={lang.code} title={lang.title}>{lang.code}</option>)}
    </select>
    <div className="translation">
      {translation.alternatives.map((a, i) => <div key={i} className="item">
        <span className="result">{a.result}</span>
        <span className="hint">{a.hint}</span>
      </div>)}
    </div>
    <button className={cn('link', disabled && 'remove')} title="Remove" onClick={onClickDelete}>&#x2716;</button>
    {translation.disabled && <button className="link" title="Restore" onClick={onClickRestore}>&#x25cb;</button>}
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
    <div className="translation-title">
      <strong className="text">Translations</strong>
      <button className="link" onClick={onClickAdd}>Add</button>
    </div>
    <div>
      {store.translations.map(translation => <TranslationBox key={translation.$id} translation={translation} />)}
    </div>
  </div>;
});

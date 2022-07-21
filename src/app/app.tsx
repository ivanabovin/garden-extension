import React, { ChangeEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Alternative, Language, store, Translation } from './store';
import { runInAction } from 'mobx';
import cn from 'classnames';
import { player } from './player';
import { copyText } from './util/clipboard';

function getLanguageOptions() {
  return Language.all.map(lang => <option key={lang.code} value={lang.code} title={lang.title}>{lang.code}</option>);
}

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
    void store.translate();
  }, []);
  const onChangeSecond = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    runInAction(() => store.second = code);
  }, []);
  const onChangeRetranslation = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    runInAction(() => store.retranslation = checked);
  }, []);
  return <div className="text-box">
    <div className="row">
      <select className="button strong" value={store.lang}
        title={Language.title(store.lang)} onChange={onChangeLang}>
        {getLanguageOptions()}
      </select>
      <input className="text" value={store.text} onChange={onChangeText} />
      <button disabled={store.busy} onClick={onClickTranslate}>Translate</button>
    </div>
    <div className="row">
      <select className="button strong second" value={store.second} disabled={!store.retranslation}
        title={Language.title(store.second)} onChange={onChangeSecond}>
        {getLanguageOptions()}
      </select>
      <input type="checkbox" checked={store.retranslation} onChange={onChangeRetranslation} />
      <span className="text">Retranslation</span>
    </div>
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
  const onClickPlay = useCallback((a: Alternative) => {
    player.play(translation.lang, a.result);
  }, []);
  const onClickCopy = useCallback((a: Alternative) => {
    void copyText(a.result);
  }, []);
  const { disabled } = translation;
  return <div className={cn('translation-box', disabled && 'disabled')}>
    <select className="button strong" value={translation.lang}
      title={Language.title(translation.lang)} onChange={onChangeLang}>
      {getLanguageOptions()}
    </select>
    <div className="translations">
      {translation.alternatives.map((a, i) => <div key={i} className="item">
        <div className="translation">
          <span className="result">{a.result}</span>
          <span className="hint">{a.hint}</span>
        </div>
        <div className="actions">
          <button className="link copy" onClick={() => onClickCopy(a)}></button>
          <button className="link play" onClick={() => onClickPlay(a)}></button>
        </div>
      </div>)}
    </div>
    <div className="buttons">
      <button className="link remove" title="Remove" onClick={onClickDelete}>&#x2716;</button>
    </div>
  </div>;
});

export const App = observer(() => {
  const onClickAdd = useCallback(() => {
    store.addTranslation();
  }, []);
  return <div className="app">
    <strong className="main-title">Jam</strong>
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

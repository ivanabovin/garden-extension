import React, { ChangeEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Alternative, Language, store, Translation } from './store';
import { runInAction } from 'mobx';
import cn from 'classnames';
import { player } from './player';
import { copyText } from './util/clipboard';

function getLanguageOptions(remove?: { text: string, title: string }) {
  const base = [];
  if (remove) base.push(<option key={'x'} value={''} title={remove.title}
    className="gray">{remove.text}</option>);
  const languages = Language.all.map(lang => <option key={lang.code} value={lang.code}
    title={lang.title}>{lang.code}</option>);
  return base.concat(languages);
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
    runInAction(() => store.retranslation = code || undefined);
  }, []);
  const empty = store.translations.length === 0;
  return <div className="text-box">
    <div className="row">
      <select className="button strong" value={store.lang}
        title={Language.title(store.lang)} onChange={onChangeLang}>
        {getLanguageOptions()}
      </select>
      <input className="text" value={store.text} onChange={onChangeText} />
      <button disabled={store.busy || empty} onClick={onClickTranslate}>Translate</button>
    </div>
    <div className="row">
      <select className={cn('button strong', store.retranslation || 'gray')}
        value={store.retranslation || ''} onChange={onChangeSecond}
        title={store.retranslation ? Language.title(store.retranslation) : 'None'}>
        {getLanguageOptions({ text: 'no', title: 'None' })}
      </select>
      <span className="text">Retranslation</span>
    </div>
  </div>;
});

export const TranslationBox = observer(({ translation }: { translation: Translation }) => {
  const onChangeLang = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    if (code) runInAction(() => translation.lang = code);
    else store.removeTranslation(translation);
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
      {getLanguageOptions({ text: '\u{1F7A9}', title: 'Remove' })}
    </select>
    <div className="translations">
      {translation.alternatives.map((a, i) => <div key={i} className={cn('item', a.hint || 'single')}>
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
    <strong className="main-title">Garden</strong>
    <TextBox />
    <div className="translation-title">
      <strong className="text">Translations</strong>
      <button className="link" onClick={onClickAdd}>Add</button>
    </div>
    {store.translations.map(translation => <TranslationBox key={translation.$id} translation={translation} />)}
  </div>;
});

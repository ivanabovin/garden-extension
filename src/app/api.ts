import { Alternative, store, Translation } from './store';
import { googleTranslate } from '../api/google';
import { runInAction } from 'mobx';
import { ensureString } from './util/object';

async function startTranslation(translation: Translation) {
  const lang = store.lang;
  const text = store.text;
  translation.clear();
  if (translation.disabled) return;
  try {
    const result = await translate(lang, translation.lang, text);
    runInAction(() => saveTranslation(translation, result));
  } catch (e) {
    console.error('translate error', e);
  }
}

async function translate(from: string, to: string, text: string): Promise<Alternative[]> {
  const response = await googleTranslate(from, to, text, true);
  const alternatives: Alternative[] = [];
  for (const at of response.alternative_translations || []) {
    for (const ae of at.alternative || []) {
      const result = ensureString(ae.word_postproc);
      alternatives.push(new Alternative(to, result));
    }
  }
  if (alternatives.length === 0) alternatives.push(new Alternative(to, text));
  return alternatives;
}

function saveTranslation(translation: Translation, alternatives: Alternative[]) {
  translation.alternatives = alternatives;
  for (const alternative of alternatives) {
    void requestHints(alternative);
  }
}

async function requestHints(alternative: Alternative) {
  try {
    const response = await googleTranslate(alternative.lang, store.my, alternative.result, false);
    const result = response.sentences[0].trans;
    runInAction(() => alternative.hint = result);
  } catch (e) {
    console.error('translate error', e);
  }
}

export class Api {
  translate() {
    if (store.busy) throw new Error('busy');
    runInAction(() => store.busy = true);
    const promises = store.translations.map(translation => {
      return startTranslation(translation);
    });
    Promise.all(promises).then(() => runInAction(() => store.busy = false));
  }
}

export const api = new Api();

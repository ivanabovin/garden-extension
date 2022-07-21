import { Alternative, store, Translation } from './store';
import { googleTranslate } from '../api/google';
import { runInAction } from 'mobx';
import { ensureString } from './util/object';

export type TranslationResult = {
  text: string,
  alternatives: Alternative[]
}

async function translate(from: string, to: string, message: string): Promise<TranslationResult> {
  const response = await googleTranslate(from, to, message);
  const text = response.sentences[0].trans;
  const alternatives: Alternative[] = [];
  for (const at of response.alternative_translations || []) {
    const source = ensureString(at.src_phrase);
    for (const ae of at.alternative || []) {
      const result = ensureString(ae.word_postproc);
      if (source !== message) console.error('unexpected source', { from, to, message, source });
      alternatives.push(new Alternative(source, result));
    }
  }
  if (alternatives.length === 0) alternatives.push(new Alternative(message, text));
  if (!alternatives.find(a => a.result === text)) {
    console.error('unexpected translation', { from, to, message, text, alternatives });
  }
  return { text, alternatives };
}

function done(translation: Translation, result: TranslationResult) {
  translation.text = result.text;
  translation.alternatives = result.alternatives;
}

export class Api {
  translate() {
    if (store.busy) throw new Error('busy');
    const lang = store.lang;
    const text = store.text;
    runInAction(() => store.busy = true);
    const promises = store.translations.map(translation => {
      translation.clear();
      if (!translation.disabled) {
        return translate(lang, translation.lang, text)
          .then(result => runInAction(() => done(translation, result)))
          .catch(e => console.error('translate error', e));
      }
    });
    Promise.all(promises).then(() => runInAction(() => store.busy = false));
  }
}

export const api = new Api();

import { store } from './store';
import { translate } from '../api/google';
import { runInAction } from 'mobx';

export class Api {
  translate() {
    if (store.busy) throw new Error('busy');
    const lang = store.lang;
    const text = store.text;
    runInAction(() => store.busy = true);
    const promises = store.translations.map(translation => {
      runInAction(() => translation.text = '');
      if (!translation.removed) {
        return translate(lang, translation.lang, text)
          .then(text => runInAction(() => translation.text = text))
          .catch(e => console.error('translate error', e));
      }
    });
    Promise.all(promises).then(() => runInAction(() => store.busy = false));
  }
}

export const api = new Api();

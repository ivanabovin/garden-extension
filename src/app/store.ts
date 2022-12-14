import { action, autorun, makeAutoObservable, runInAction } from 'mobx';
import { ensureDefined, isDefined } from './util/object';
import { translate } from './api/translate';

export class Language {
  code: string;
  title: string;

  static all: Language[] = [
    new Language('en', 'English'),
    new Language('fr', 'French'),
    new Language('de', 'German'),
    new Language('it', 'Italian'),
    new Language('pt', 'Portuguese'),
    new Language('ru', 'Russian'),
    new Language('es', 'Spanish'),
  ];

  private constructor(code: string, title: string) {
    makeAutoObservable(this);
    this.code = code;
    this.title = title;
  }

  static find(code: string | undefined): Language | undefined {
    return code == null ? undefined : Language.all.find(lang => lang.code === code);
  }

  static take(code: string): Language {
    return ensureDefined(Language.find(code), () => 'language: ' + code);
  }

  static title(code: string): string {
    return Language.take(code).title;
  }
}

export class Alternative {
  constructor(readonly result: string, readonly hint: string) {
  }
}

export class Translation {
  private static $ID = 0;
  readonly $id = ++Translation.$ID;
  lang: string = 'en';
  alternatives: Alternative[] = [];
  disabled = false;

  constructor(lang: string) {
    makeAutoObservable(this);
    this.lang = lang;
  }

  static parse(lang: string): Translation | undefined {
    return Language.find(lang) ? new Translation(lang) : undefined;
  }
}

export class Store {
  busy = false;
  lang: string = 'en';
  retranslation: string | undefined;
  text: string = '';
  translations: Translation[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async config() {
    await this.load();
    autorun(async () => {
      await this.save();
    });
  }

  addTranslation() {
    const used = this.translations.map(t => t.lang).concat([this.lang]);
    const lang = Language.all.find(lang => !used.includes(lang.code));
    const code = lang?.code ?? 'en';
    this.translations.push(new Translation(code));
  }

  removeTranslation(translation: Translation) {
    const index = this.translations.indexOf(translation);
    if (index >= 0) this.translations.splice(index, 1);
  }

  async translate() {
    if (this.busy) throw new Error('busy');
    runInAction(() => {
      this.busy = true;
    });
    try {
      const languages = Array.from(new Set(this.translations.filter(t => !t.disabled).map(t => t.lang))).sort();
      const results = await translate(this.lang, this.retranslation, this.text, languages);
      runInAction(() => {
        this.translations.forEach(t => t.alternatives = t.disabled ? [] :
          results[t.lang].alternatives.map(a => new Alternative(a.result, a.hint)));
      });
    } catch (e) {
      console.error('translate error', e);
      runInAction(() => this.translations.forEach(t => t.alternatives = []));
    } finally {
      runInAction(() => this.busy = false);
    }
  }

  private async load() {
    chrome.storage.sync.get(['lang', 'retranslation', 'text', 'translations'], action(data => {
      this.lang = Language.find(data.lang)?.code ?? 'en';
      this.retranslation = Language.find(data.retranslation)?.code;
      this.text = data.text ?? 'garden';
      this.translations = (data.translations as string[] ?? ['fr'])
        .map(lang => Translation.parse(lang)).filter(isDefined);
    }));
  }

  private async save() {
    await chrome.storage.sync.set({
      lang: this.lang,
      retranslation: this.retranslation,
      text: this.text,
      translations: this.translations.map(t => t.lang),
    });
  }
}

export const store = new Store();

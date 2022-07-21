import { autorun, makeAutoObservable } from 'mobx';
import { loadString, parseArray, save } from './util/storage';
import { ensureDefined } from './util/object';

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

  static find(code: string): Language | undefined {
    return Language.all.find(lang => lang.code === code);
  }

  static take(code: string): Language {
    return ensureDefined(Language.find(code), () => 'language: ' + code);
  }
}

export class Alternative {
  constructor(readonly source: string, readonly result: string) {
  }
}

export class Translation {
  private static $ID = 0;
  readonly $id = ++Translation.$ID;

  lang: string = 'en';
  text: string = '';
  alternatives: Alternative[] = [];
  disabled = false;

  constructor(lang: string) {
    makeAutoObservable(this);
    this.lang = lang;
  }

  clear() {
    this.text = '';
    this.alternatives = [];
  }

  static parse(lang: string): Translation | undefined {
    return new Translation(lang);
  }
}

export class Store {
  busy = false;
  lang: string = 'en';
  text: string = '';
  translations: Translation[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
    autorun(() => {
      this.save();
    });
  }

  addTranslation() {
    const used = this.translations.map(t => t.lang).concat([this.lang]);
    const lang = Language.all.find(lang => !used.includes(lang.code));
    const code = lang?.code ?? 'en';
    this.translations.push(new Translation(code));
  }

  removeTranslation(translation: Translation) {
    if (!translation.disabled) {
      translation.disabled = true;
      return;
    }
    const index = this.translations.indexOf(translation);
    if (index >= 0) this.translations.splice(index, 1);
  }

  private load() {
    this.lang = loadString('lang') ?? 'en';
    this.text = loadString('text') ?? '';
    this.translations = parseArray('translations', Translation.parse) ?? [];
  }

  private save() {
    const translations = this.translations.map(t => t.lang);
    save('lang', this.lang);
    save('text', this.text);
    save('translations', translations);
  }
}

export const store = new Store();    

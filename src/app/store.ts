import { makeAutoObservable } from 'mobx';
import { parseArray, parseString } from './util/storage';
import { ensureDefined, ensureString } from './util/object';

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
  static defaults: Language[] = Language.all.concat();
  static en: Language = Language.take('en');

  private constructor(code: string, title: string) {
    makeAutoObservable(this);
    this.code = code;
    this.title = title;
  }

  static parse(json: string): Language | undefined {
    return Language.find(ensureString(json));
  }

  static find(code: string): Language | undefined {
    return Language.all.find(lang => lang.code === code);
  }

  static take(code: string): Language {
    return ensureDefined(Language.find(code), () => 'language: ' + code);
  }
}

export class Store {
  lang: Language = Language.en;
  languages: Language[] = Language.defaults;

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  private load() {
    this.lang = parseString('lang', Language.take) ?? Language.en;
    this.languages = parseArray('languages', Language.parse) ?? Language.defaults;
  }
}

export const store = new Store();    

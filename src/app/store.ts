import { makeAutoObservable } from 'mobx';
import { parseArray } from './util/storage';
import { ensureString, optionalString } from './util/object';

export class Language {
  name: string;
  text: string;

  constructor(name: unknown, text: unknown) {
    makeAutoObservable(this);
    this.name = ensureString(name);
    this.text = optionalString(text, '');
  }

  static parse(json: Record<string, unknown>): Language | undefined {
    return new Language(json.name, json.text);
  }
}

export class Store {
  languages: Language[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  private load() {
    this.languages = parseArray('languages', Language.parse);
  }
}

export const store = new Store();    

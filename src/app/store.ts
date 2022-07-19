import { makeAutoObservable } from 'mobx';
import { parseArray } from './util/storage';

class Language {
  name: string;
  text: string;

  constructor(name: string, text: string) {
    makeAutoObservable(this);
    this.name = name;
    this.text = text;
  }

  static parse(json: Record<string, any>): Language | undefined {
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

import { render } from './app';
import { event } from './event';
import { makeAutoObservable } from 'mobx';

export class Store {
  show = false;

  private mount = false;

  constructor() {
    makeAutoObservable(this);
    event.on('onClickedExtension', this.onClickedExtension);
  }

  onClickedExtension = () => {
    if (!this.mount) {
      render();
      this.mount = true;
    }
    this.show = !this.show;
    event.emit('onShowContent', this.show);
  };
}

export const store = new Store();

import { App } from './app';
import { event } from './event';

export class Store {
  private mount = false;
  private show = false;

  constructor() {
    event.on('onClickedExtension', this.onClickedExtension);
  }

  onClickedExtension = () => {
    if (!this.mount) {
      App.render();
      this.mount = true;
    }
    this.show = !this.show;
    event.emit('onShowContent', this.show);
  };
}

export const store = new Store();

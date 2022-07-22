export class Frame {
  private mount = false;
  private show = false;
  private frame!: HTMLIFrameElement;

  toggle() {
    if (!this.mount) {
      this.render();
      this.mount = true;
      this.show = true;
    } else {
      this.show = !this.show;
    }
    this.update();
  }

  private update() {
    this.frame.style.display = this.show ? 'block' : 'none';
    void chrome.runtime.sendMessage({ type: 'show', show: this.show });
  }

  private render() {
    const frame = document.createElement('iframe');
    frame.src = chrome.runtime.getURL('garden.html');
    frame.classList.add('garden');
    document.body.append(frame);
    this.frame = frame;
  }
}

export const frame = new Frame();

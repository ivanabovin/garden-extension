export class AudioPlayer {
  private readonly audio: HTMLAudioElement;

  constructor() {
    this.audio = document.createElement('audio');
    document.body.append(this.audio);
    this.audio.addEventListener('ended', () => this.audio.src = '');
  }

  play(lang: string, text: string) {
    const url = `https://translate.google.com.vn/translate_tts?client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
    this.audio.src = url;
    void this.audio.play();
  }
}

export const player = new AudioPlayer();

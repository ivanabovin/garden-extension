import { createNanoEvents } from 'nanoevents';

interface Event {
  onClickedExtension(): void;
  onShowContent(show: boolean): void;
}

export const event = createNanoEvents<Event>();

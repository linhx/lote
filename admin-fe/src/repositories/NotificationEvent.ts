import { API_URL } from '../constants';

const PATH = new URL('notification', API_URL).href;

type Subscriber = (this: EventSource, ev: MessageEvent) => any;

export enum NotificationType {
  success = 'success',
  error = 'error',
  info = 'info',
}

export interface NotificationEventData {
  message: string;
  type: NotificationType;
  error?: any;
}

export class NotificationEvent {
  eventSource: EventSource;

  constructor() {
    this.eventSource = new EventSource(PATH, { withCredentials: true });
  }

  subscribe(subscriber: Subscriber) {
    this.eventSource.addEventListener('message', subscriber);
  }

  unsubscribe(subscriber: Subscriber) {
    this.eventSource.removeEventListener('message', subscriber);
  }

  close() {
    this.eventSource.close();
  }
}

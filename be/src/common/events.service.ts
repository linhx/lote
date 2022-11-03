import { Injectable, MessageEvent } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { CHANNEL_NOTIFICATION } from 'src/constants/events';

export enum NotificationType {
  success = 'success',
  error = 'error',
  info = 'info',
}

interface NotificationData {
  type: NotificationType;
  message: string;
  error?: any;
}

@Injectable()
export class EventsService {
  private readonly emitter = new EventEmitter();

  subscribe(channel: string) {
    return fromEvent(this.emitter, channel);
  }

  emit(channel: string, data?: object) {
    this.emitter.emit(channel, { data });
  }

  emitNotification(data?: NotificationData) {
    this.emit(CHANNEL_NOTIFICATION, data);
  }
  subscribeNotification() {
    return this.subscribe(CHANNEL_NOTIFICATION) as Observable<MessageEvent>;
  }
}

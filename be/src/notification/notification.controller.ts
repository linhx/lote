import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from 'src/common/events.service';
import { PATH_NOTIFICATION } from 'src/constants';

@Controller(PATH_NOTIFICATION)
export class NotificationController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Sse('')
  public notification(): Observable<MessageEvent> {
    return this.eventsService.subscribeNotification();
  }
}

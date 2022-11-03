import { Module } from '@nestjs/common';
import { Db } from './db';
import { EventsService } from './events.service';

@Module({
  imports: [],
  controllers: [],
  providers: [Db, EventsService],
  exports: [Db, EventsService],
})
export class CommonModule {}

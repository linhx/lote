import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    CommonModule,
  ],
  controllers: [NotificationController]
})
export class NotificationModule {}

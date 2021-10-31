import { Module } from '@nestjs/common';
import { Db } from './db';

@Module({
  imports: [],
  controllers: [],
  providers: [Db],
  exports: [Db]
})
export class CommonModule {}

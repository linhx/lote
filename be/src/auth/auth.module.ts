import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SsoStrategy } from './sso.strategy';

@Module({
  imports: [PassportModule, HttpModule],
  providers: [SsoStrategy]
})
export class AuthModule {}

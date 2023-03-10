import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { Message } from './mail.interface';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  send(msg: Message) {
    return sgMail.send(msg);
  }

  sendToAdmin(msg: Omit<Message, 'to'>) {
    const _mgs: Message = {
      ...msg,
      to: this.configService.get<string>('EMAIL_NOTIFICATION'),
    };
    return this.send(_mgs);
  }
}

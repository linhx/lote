import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Session } from 'inspector';
import { ClientSession, Connection } from 'mongoose';

export type CSession = ClientSession | undefined;

@Injectable()
export class Db {
  constructor(@InjectConnection() private conn: Connection) {}

  async withTransaction(session: CSession, callback: (session: CSession) => any) {
    const _session = session ? session : await this.conn.startSession();
    return callback(_session);
  }
}

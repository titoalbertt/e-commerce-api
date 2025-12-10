import { Injectable } from '@nestjs/common';
import { db } from './db';
import * as schema from './schema';

@Injectable()
export class DBService {
  get db() {
    return db;
  }

  get schema() {
    return schema;
  }
}

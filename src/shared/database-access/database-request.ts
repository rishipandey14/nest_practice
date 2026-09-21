import { Request } from 'express';
import { databaseTypes } from './database-context.types';

export interface DatabaseRequest extends Request {
  dbContext?: {
    database: databaseTypes;
  };
}
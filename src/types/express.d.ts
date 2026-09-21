import type { databaseTypes } from '../shared/database-access/database-context.types';

declare global {
  namespace Express {
    interface Request {
      dbContext?: {
        database: databaseTypes;
      };
    }
  }
}

export {};
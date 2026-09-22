import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserDbService } from 'src/userDbMapping/userDbMapping.service';
import { isDatabaseType } from '../database-context.types';

@Injectable()
export class DatabaseAccessMiddleware implements NestMiddleware {
    constructor(private readonly userDbService: UserDbService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.headers['x-id'];
            const database = req.headers['x-db'];

            if (!userId) {
                return res.status(400).json({
                    message: 'x-id header is required',
                });
            }

            if (!database) {
                return res.status(400).json({
                    message: 'x-db header is required',
                });
            }

            const id = String(userId).trim();
            const requestedDB = String(database).trim().toLowerCase();

            // console.log("userId -> ", id);
            // console.log("requestedDB -> ", requestedDB);

            if (!isDatabaseType(requestedDB))
                throw new ForbiddenException('Unsupported database, choose another.');

            const mapping = await this.userDbService.findMapping(id, requestedDB);

            // console.log("mapping -> ", mapping);

            // we can change the message here to safeguard user's data
            if (!mapping)
                return res.status(403).json({
                    message: 'User is not associated with this database',
                });

            req.dbContext = { database: requestedDB };
            // console.log("req.dbContext -> ", req.dbContext);

            next();
        } catch (error) {
            console.error('DB Access Middleware Error:', error);

            return res.status(500).json({
                message: 'Failed to verify database access',
            });
        }
    }
}

import crypto from 'node:crypto';
import { join } from 'node:path';
import pino from 'pino';
import pinoHttp from 'pino-http';

const httpTransport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            level: 'info',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                singleLine: true,
                ignore: 'pid,hostname',
            },
        },
        {
            target: 'pino-roll',
            level: 'info',
            options: {
                file: join(process.cwd(), 'logs', 'http.log'),
                frequency: 'daily',
                size: '50m',
                mkdir: true,
                limit: {
                    count: 7,
                },
                dateFormat: 'yyyy-MM-dd',
            },
        },
    ],
});

const httpLogger = pino(
    {
        level: 'info',

        serializers: {
            req: (req: any) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                remoteAddress: req.remoteAddress,
            }),

            res: (res: any) => ({
                statusCode: res.statusCode,
            }),
        },

        redact: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers.postman-token',
            'req.body.password',
            'req.body.confirmPassword',
            'req.body.token',
        ],
    },
    httpTransport,
);

export const httpLoggerMiddleware = pinoHttp({
    logger: httpLogger,

    genReqId: () => {
        return crypto.randomUUID();
    },

    autoLogging: true,
});

export const nestLoggerConfig = {
    pinoHttp: {
        level: 'info',
        autoLogging: false,

        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                singleLine: true,
                ignore: 'pid,hostname',
            },
        },
    },
};

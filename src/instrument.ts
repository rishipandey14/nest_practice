// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';

Sentry.init({
    dsn: 'https://73f72a9a45574bb3d10466f60b890fac@o4512129408565248.ingest.de.sentry.io/4512129415118928',

    enableLogs: true,

    integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    dataCollection: {
        // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
        // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
        // userInfo: false,
        // httpBodies: [],
    },
});

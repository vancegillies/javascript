import * as Sentry from '@sentry/node';
import { OnUncaughtException } from '@sentry/node/dist/integrations';

const CLERK_SENTRY_DSN =
  'https://146f349c99b74441933d6bda996062c5@o449981.ingest.sentry.io/6189093';

const sentryProxy = {
  init,
  captureException: (_message: string) => {},
  addBreadcrumb: (_breadcrumb: Breadcrumb) => {},
};

type TraceOptions = {
  enable: boolean;
  apiKey: string;
  apiVersion: string;
  libName: string;
  libVersion: string;
};

type Breadcrumb = {
  message: string;
  category?: string;
};

function init(options: TraceOptions) {
  if (!options.enable) {
    return;
  }

  try {
    Sentry.init({
      dsn: CLERK_SENTRY_DSN,
      defaultIntegrations: false,
      integrations: [new OnUncaughtException()],
      beforeSend(event) {
        if (!event.extra?.clerk) return null;
        event.exception?.values?.[0].stacktrace?.frames?.pop();
        return event;
      },
    });
    Sentry.setContext('Clerk', {
      apiVersion: options.apiVersion,
      libName: options.libName,
      libVersion: options.libVersion,
      nodeVersion: process.version,
      platform: process.platform,
      nodeEnvironment: process.env.NODE_ENV,
    });

    Sentry.setTag('apiKey', options.apiKey);

    sentryProxy.captureException = (message: string) =>
      Sentry.captureException(message, { extra: { clerk: true } });

    sentryProxy.addBreadcrumb = ({ message, category }: Breadcrumb) =>
      Sentry.addBreadcrumb({
        category: category || 'auth flow',
        message: message,
        level: Sentry.Severity.Info,
      });
  } catch (err) {
    console.error('Clerk: Something went wrong with tracing collection.');
  }
}

export const Tracer = sentryProxy;

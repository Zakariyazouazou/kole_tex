import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they contain a dot, e.g. `favicon.ico`
  // - api routes
  // - _next routes
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

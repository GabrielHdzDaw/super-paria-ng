import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.startsWith('eb/') ||
    req.url.startsWith('assets/') ||
    req.url.startsWith('http')
  ) {
    return next(req);
  }

  const serverUrl = isDevMode()
    ? 'http://localhost:3000'
    : 'https://miservidor.com/superparia';

  const isAuthenticationRequest =
    req.url === 'auth/login' || req.url === 'auth/register';
  const accessToken = localStorage.getItem('accessToken');

  return next(
    req.clone({
      url: `${serverUrl}/${req.url}`,
      setHeaders: accessToken && !isAuthenticationRequest
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    }),
  );
};

import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('eb/')) {
    return next(req);
  }

  const serverUrl = isDevMode() ? 'http://localhost:3000' : 'https://miservidor.com/superparia';
  const reqClone = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(reqClone);
};

import {
  ApplicationConfig,
  forwardRef,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { userReducer } from './store/user/user.reducer';
import { provideEffects } from '@ngrx/effects';
import UserEffects from './store/user/user.effects';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../types';
import { isPlatformBrowser } from '@angular/common';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ user: userReducer }),
    provideEffects([UserEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAppInitializer(() => appInitializer()),
  ],
};

function appInitializer() {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return;

  const apiUrl = environment.apiUrl;
  const http = inject(HttpClient);
  const token = localStorage.getItem('access');
  const createdAt = localStorage.getItem('createdAt');

  console.log(new Date().getDate() - new Date(createdAt ?? '').getDate());

  const isExpired = createdAt
    ? new Date().getDate() - new Date(createdAt).getDate() > 29 / (60 * 1000)
    : false;

  localStorage.removeItem('createdAt');

  if (!token || (token && isExpired)) {
    return firstValueFrom(
      http.get<{ user: User; token: string }>(`${apiUrl}/api/auth/guest`).pipe(
        tap((response) => {
          localStorage.setItem('access', response.token);
          console.log(response);
        }),
        catchError((error) => error)
      )
    );
  } else if (token && createdAt && !isExpired) {
    return firstValueFrom(
      http
        .get<{ user: User; token: string }>(`${apiUrl}/api/auth/refreshToken`)
        .pipe(
          tap((response) => {
            localStorage.setItem('access', response.token);
            localStorage.setItem('createdAt', new Date().toISOString());
            console.log(response);
          }),
          catchError((error) => error)
        )
    );
  }

  return;
}

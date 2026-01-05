import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideRouter, withDebugTracing} from '@angular/router';
import {appRoutes} from './app/app.routes';
import {isDevMode} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, ...(isDevMode() ? [withDebugTracing()] : []))
  ]
})
  .catch(err => console.error(err));

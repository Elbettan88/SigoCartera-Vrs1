import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Cambia "App" por "AppComponent"

bootstrapApplication(AppComponent, appConfig) // <-- Cambia "App" por "AppComponent"
  .catch((err) => console.error(err));

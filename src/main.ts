import { isDevMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withDebugTracing } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
	providers: [provideRouter(appRoutes, ...(isDevMode() ? [withDebugTracing()] : []))],
}).catch((err) => console.error(err));

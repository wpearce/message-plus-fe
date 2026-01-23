# Angular Extension Notes

## Style observed in this codebase
- **Angular v20 with standalone components**: Components use `standalone: true` and declare their dependencies in an `imports` array rather than NgModules.
- **Inline templates and styles**: Components often use inline `template` and `styles` strings instead of external files.
- **Modern template control flow**: Uses `@if`, `@else`, and `@for` blocks instead of `*ngIf`/`*ngFor`.
- **Signals + RxJS interop**: UI state is handled with `signal()` and `toSignal()` for observable-backed data.
- **`inject()` for DI**: Services are acquired via `inject()` rather than constructor injection.
- **Routing with standalone components**: Routes are defined in `app.routes.ts`, using direct `component` references and `loadComponent` for lazy loading.
- **App-wide providers via `ApplicationConfig`**: `app.config.ts` uses `provideRouter`, `provideHttpClient`, `provideZonelessChangeDetection`, and `importProvidersFrom` for Material.
- **Angular Material usage**: Material modules are provided at the app level; `MatDialog` is used in feature components.
- **OIDC auth integration**: `angular-auth-oidc-client` is wired in with initializer checks and route guards.

## How to extend consistently
- Prefer **standalone components** with `standalone: true` and explicit `imports`.
- Keep **inline templates/styles** unless the feature is large enough to justify external files.
- Use **signals** for component state and `toSignal()` for observable streams.
- Use **`inject()`** to access services.
- Use **modern control flow** (`@if`, `@for`) in templates.
- Add **routes** in `app.routes.ts` and use `loadComponent` when lazy-loading.
- Register **global providers** in `app.config.ts` using `ApplicationConfig`.
- Reuse **Material tokens and variables** already present in styles for visual consistency.

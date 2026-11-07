# MessagePlusFe

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Appearance

The header's **New UI** switch toggles between the original UI (the default) and
Signal. `AppearanceService` restores and saves `current` or `signal` under the
`messageplus.appearance` local storage key. If storage is unavailable, switching
still works for the current session.

Both appearances use the same components, forms, routes, and message logic.
Original styles stay in their components; Signal overrides live exclusively in
`src/app/styles/_signal.scss`, scoped to `html[data-appearance='signal']`.
The root attribute also covers Material dialogs and snackbars. Apply appearance
changes through the service rather than conditionally recreating components, so
filters, pagination, and unsaved edits survive a toggle.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev) runner in the default browserless `jsdom` environment, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

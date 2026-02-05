import { category, topic } from '../../utils/topicHelpers';

export const legacyInterop = category('Legacy & Interoperability', [
  topic(
    'NgModules',
    `Before Angular 14, **NgModules were the mandatory way to organize an application**. An NgModule is a class decorated with \`@NgModule\` that acts as a container for a cohesive block of code. It tells the Angular compiler which components, directives, and pipes belong together and how they should interact with the rest of the app.

> In modern "Standalone" Angular, NgModules are optional but still crucial for maintaining legacy codebases and using certain third-party libraries.

---

### 1. The Anatomy of an NgModule

An NgModule metadata object has four key arrays:

| Array | Description |
|-------|-------------|
| \`declarations\` | The components, directives, and pipes that belong to this module. (Standalone components cannot be declared here) |
| \`imports\` | Other modules (or Standalone components) whose exported classes are needed by the component templates declared in this module |
| \`exports\` | The subset of declarations that should be visible and usable in the templates of other modules |
| \`providers\` | Services that the module contributes to the global or local Dependency Injection collection |

\`\`\`typescript
@NgModule({
  declarations: [OldUserComponent, OldSearchPipe],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [UserService],
  exports: [OldUserComponent]
})
export class UserModule { }
\`\`\`

---

### 2. The "Mental Model" Shift

| Approach | Description |
|----------|-------------|
| **Standalone** | Everything is self-contained. If Component A uses Component B, A imports B directly |
| **NgModule** | Components are "anonymous" within the module. If Component A uses Component B, they don't know about each other; they both just exist inside the same \`declarations\` array of the module |

---

### 3. Interoperability (Mixing Old and New)

The most important part of "Legacy & Interop" is knowing how to make them talk:

**Using Standalone in an NgModule:** Import the Standalone component into the \`imports\` array of the NgModule.

\`\`\`typescript
@NgModule({
  imports: [NewStandaloneComponent], // Works just like importing a module
})
export class LegacyModule { }
\`\`\`

**Using an NgModule in Standalone:** Import the NgModule into the \`imports\` array of the Standalone component.

\`\`\`typescript
@Component({
  standalone: true,
  imports: [LegacyModule, MatButtonModule], // Import the whole module
  template: \`<app-old-component />\`
})
export class NewComponent { }
\`\`\`

---

### 4. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | React has no concept of "Modules" at the framework level. It relies entirely on standard JavaScript import/export |
| **Angular** | NgModules are a secondary "packaging" system on top of JavaScript imports. While they added complexity, they allowed Angular to perform "Template Discovery" (knowing which tags are valid in a template) before the Standalone era |

---

### 5. Why they still exist

| Reason | Description |
|--------|-------------|
| **Library Support** | Many older UI libraries (like some versions of Angular Material or PrimeNG) still use NgModules |
| **Organization** | Some developers still prefer them for grouping massive sets of related utilities into a single "feature" import |
| **App Bootstrapping** | Older apps start via \`platformBrowserDynamic().bootstrapModule(AppModule)\`, whereas modern apps use \`bootstrapApplication(AppComponent)\` |`,
    ['declarations', 'exports', 'providers', 'NgModule'],
    'intermediate'
  ),
  topic(
    'SCAM Pattern',
    `The SCAM pattern was a popular architectural bridge used by the Angular community **before Standalone Components** were officially introduced in v14. It stands for **Single Component Angular Module**.

In this pattern, every single component (or directive/pipe) gets its own dedicated NgModule. This effectively mimics the "standalone" behavior we have today using the legacy module system.

---

### 1. How it Works

Instead of a "Feature Module" containing 10 components, you create 10 modules, each containing exactly one component.

\`\`\`typescript
// user-profile.component.ts
@Component({
  selector: 'app-user-profile',
  template: \`...\`
})
export class UserProfileComponent {}

// The SCAM: A module just for this component
@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, MatCardModule],
  exports: [UserProfileComponent],
})
export class UserProfileComponentModule {}
\`\`\`

To use this component elsewhere, you would import \`UserProfileComponentModule\` instead of a giant shared module.

---

### 2. Why was this used?

| Reason | Description |
|--------|-------------|
| **Tree Shaking** | By splitting modules into single units, the build tool (Webpack) could more easily remove code that wasn't being used |
| **Explicit Dependencies** | It made it very clear exactly what a component needed to run. If you looked at the \`imports\` of the SCAM, you saw the component's exact dependencies |
| **Migration Path** | Applications built with the SCAM pattern were the easiest to migrate to Standalone Components because the dependencies were already isolated |

---

### 3. Transitioning to Standalone

The SCAM pattern is now considered **obsolete** because Standalone Components do exactly this but with significantly less boilerplate.

To migrate a SCAM to modern Angular, you simply:

1. Add \`standalone: true\` to the \`@Component\`
2. Move the \`imports\` from the NgModule into the \`@Component\` itself
3. Delete the NgModule class entirely

---

### 4. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | React components are naturally "standalone." If a component uses a button, it imports that button |
| **Legacy Angular** | Components were "hidden" inside modules. You had to know which module declared a component to use it |
| **SCAM** | Was a "hack" to make Angular feel more like React's component-based architecture before the framework officially supported it |

---

### 5. When will you see this?

You will likely encounter this in **v12-v15 codebases** that were being prepared for the Standalone era. If you see a file structure where every component has a sibling \`module.ts\` file with only one declaration, you are looking at a SCAM.`,
    ['single-component-angular-module', 'migration', 'pattern'],
    'intermediate'
  ),
  topic(
    'Migrating to Standalone',
    `Migrating to Standalone is the process of refactoring an Angular application to move away from NgModules and toward the modern \`standalone: true\` architecture. This is a crucial step for using modern features like Deferrable Views and simplified Dependency Injection.

---

### 1. The Schematic (Automated Migration)

Angular provides a built-in "migration tool" via the CLI. It is highly recommended to use this rather than manual refactoring for large codebases.

**The Command:**

\`\`\`bash
ng generate @angular/core:standalone
\`\`\`

This migration happens in three distinct steps/runs:

1. **Convert components/pipes/directives:** It adds \`standalone: true\` and populates the \`imports\` array based on what was in the NgModule
2. **Remove unnecessary NgModules:** It deletes modules that no longer declare anything
3. **Bootstrap the application:** It changes \`main.ts\` from \`bootstrapModule(AppModule)\` to \`bootstrapApplication(AppComponent)\`

---

### 2. Manual Refactoring

If you are migrating a single component manually, the pattern looks like this:

**Before (Legacy):**

\`\`\`typescript
@Component({
  selector: 'app-user',
  template: \`<div *ngIf="isLoggedIn">{{ name }}</div>\`
})
export class UserComponent { ... }

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule] // NgIf lives here
})
export class UserModule {}
\`\`\`

**After (Standalone):**

\`\`\`typescript
@Component({
  selector: 'app-user',
  standalone: true, // 1. Set to true
  imports: [CommonModule], // 2. Import dependencies directly
  template: \`<div *ngIf="isLoggedIn">{{ name }}</div>\`
})
export class UserComponent { ... }
// 3. Delete the UserModule class
\`\`\`

---

### 3. Bootstrapping the App

The biggest change is in \`main.ts\`. In a standalone world, there is no \`AppModule\`.

**Modern main.ts:**

\`\`\`typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),      // Instead of RouterModule.forRoot()
    provideHttpClient(),        // Instead of HttpClientModule
  ]
}).catch(err => console.error(err));
\`\`\`

---

### 4. Interop: Using Modules in Standalone

You don't have to migrate everything at once. A Standalone Component can import an NgModule.

\`\`\`typescript
@Component({
  standalone: true,
  imports: [
    MatButtonModule, // Importing a legacy Library Module
    SharedModule     // Importing your own legacy SharedModule
  ],
  ...
})
\`\`\`

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Has always been "standalone." Every file is a module, and you import exactly what you need |
| **Angular Migration** | Is essentially Angular catching up to the "Standard ES Module" way of thinking. The "Migration" is really just moving your dependency list from a separate \`module.ts\` file into the \`@Component\` decorator |

---

### 6. Why Bother Migrating?

| Reason | Description |
|--------|-------------|
| **Performance** | Tree-shaking is much more effective when the compiler knows exactly which components are used |
| **Exclusivity** | Features like \`@defer\` only work with standalone components |
| **Developer Experience** | No more "Forgot to import module" errors that only appear at runtime; everything is explicit in the component file |`,
    ['importProvidersFrom', 'migration', 'standalone'],
    'intermediate'
  ),
]);

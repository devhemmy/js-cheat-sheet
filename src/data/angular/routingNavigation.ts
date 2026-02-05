import { category, topic } from '../../utils/topicHelpers';

export const routingNavigation = category('Routing & Navigation', [
  topic(
    'Router Config',
    `In modern Angular (v14+), routing is no longer managed by "Modules." Instead, it is configured using a **functional approach** within the \`app.config.ts\`. The router maps a URL path to a specific Standalone Component.

---

### 1. The Modern Setup

In your \`app.config.ts\`, you use \`provideRouter\` to register your routes and enable specific features.

\`\`\`typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Essential for Signals (maps params to @Input)
      withViewTransitions()         // Enables the View Transition API (Native feel)
    )
  ]
};
\`\`\`

---

### 2. Route Definitions

Routes are defined as an array of objects. Since you are coming from React/Vue, the syntax will feel very familiar, but Angular's **Lazy Loading** is built-in at the route level.

\`\`\`typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent // Eagerly loaded
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component')
      .then(m => m.SettingsComponent) // Lazy loaded (Standard)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./user/user.component'),
    data: { role: 'admin' } // Static metadata
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./not-found.component') // Catch-all (404)
  }
];
\`\`\`

---

### 3. Key Concepts for React/Vue Devs

| Concept | Description |
|---------|-------------|
| \`pathMatch: 'full'\` | In React Router, paths match exactly by default or via \`exact\`. In Angular, the default is \`prefix\`. For the empty path \`''\`, you must use \`pathMatch: 'full'\` to prevent it from matching every single URL |
| \`loadComponent\` vs \`component\` | In React, you use \`React.lazy()\` inside the component tree. In Angular, you define the lazy boundary at the Router level. This allows the router to fetch the JS chunk before trying to render the component |
| \`withComponentInputBinding()\` | This is a modern game-changer. It automatically maps Route Params (\`:id\`), Query Params (\`?search=...\`), and Static Data to component Signal Inputs |

---

### 4. Nesting (Child Routes)

Angular handles nested layouts using the \`children\` array and the \`<router-outlet />\` component (similar to \`<Outlet />\` in React Router).

\`\`\`typescript
{
  path: 'parent',
  component: ParentLayoutComponent,
  children: [
    { path: 'profile', component: ProfileComponent },
    { path: 'security', component: SecurityComponent }
  ]
}
\`\`\`

The \`ParentLayoutComponent\` would contain a \`<router-outlet />\` where the children are injected.

---

### 5. Strategy: Config vs. Navigation

| Type | Approach |
|------|----------|
| **Config** | Centralized in \`app.routes.ts\` |
| **Navigation (HTML)** | Use the \`routerLink\` directive: \`<a routerLink="/dashboard">Home</a>\` |
| **Navigation (Code)** | Use the \`Router\` service: \`this.router.navigate(['/user', id]);\` |`,
    ['loadComponent', 'lazy-loading', 'routes'],
    'beginner'
  ),
  topic(
    'Router Inputs',
    `In modern Angular (v16+), you no longer need to inject the \`ActivatedRoute\` service just to get a URL parameter. By enabling **Component Input Binding**, the router can "push" path parameters, query parameters, and static data directly into your component's \`@Input\` properties or Signal Inputs.

---

### 1. Enabling the Feature

To make this work, you must add \`withComponentInputBinding()\` to your \`provideRouter\` call in the \`app.config.ts\`.

\`\`\`typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
\`\`\`

---

### 2. Mapping URL Data to Signals

Once enabled, the router looks for inputs that match the names defined in your route config.

**The Route Definition:**

\`\`\`typescript
{
  path: 'product/:productId',
  component: ProductDetailComponent,
  data: { section: 'Electronics' } // Static data
}
\`\`\`

**The Component (Signal-First):**

\`\`\`typescript
@Component({ ... })
export class ProductDetailComponent {
  // 1. Path Parameter (:productId)
  productId = input.required<string>();

  // 2. Static Data (section)
  section = input<string>();

  // 3. Query Parameter (?mode=edit)
  // If the URL is /product/123?mode=edit, this will catch 'edit'
  mode = input<string>();

  constructor() {
    effect(() => {
      console.log('Product ID changed to:', this.productId());
    });
  }
}
\`\`\`

---

### 3. Key Benefits

| Benefit | Description |
|---------|-------------|
| **No RxJS boilerplate** | You don't have to subscribe to \`route.params.pipe(...)\` and manually manage unsubscriptions |
| **Reactivity** | Because these are Signal Inputs, they are automatically reactive. If the user navigates from \`/product/1\` to \`/product/2\`, the \`productId\` signal updates, and any \`computed\` or \`effect\` depending on it runs instantly |
| **Simpler Testing** | You can test the component by simply passing values to its inputs, rather than mocking a complex \`ActivatedRoute\` service |

---

### 4. Comparison: React vs. Angular

**React (React Router):**

\`\`\`javascript
function ProductDetail() {
  const { productId } = useParams(); // Hook-based
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  // Logic here...
}
\`\`\`

**Angular (Signal Inputs):**

\`\`\`typescript
@Component({ ... })
export class ProductDetailComponent {
  productId = input.required<string>(); // Automatically bound
  mode = input<string>();               // Query param auto-bound
}
\`\`\`

The Angular approach requires less boilerplate in the component itself, as the binding is configured once at the router level.`,
    ['params', 'input-binding', 'router'],
    'intermediate'
  ),
  topic(
    'Guards & Resolvers',
    `Guards and Resolvers are logic gates and data pre-fetchers that run during the navigation process, **before a component is even instantiated**.

- **Guards:** Decide if the user is allowed to navigate to or away from a route (e.g., Authentication)
- **Resolvers:** Ensure the data is ready before the page is shown, preventing "empty" states or layout shifts

> In modern Angular (v15+), these have shifted from complex Classes to **Functional Guards**, making them much lighter and easier to compose.

---

### 1. Functional Guards (CanActivate)

Instead of creating a class with a \`canActivate\` method, you now write a simple function and use \`inject()\` to access services.

**Example: Auth Guard**

\`\`\`typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to login if not authenticated
    return router.parseUrl('/login');
  }
};
\`\`\`

---

### 2. Resolvers (ResolveFn)

A Resolver fetches data before the component loads. The component receives this data via Router Inputs (as discussed in the previous topic).

**Example: Product Resolver**

\`\`\`typescript
export const productResolver: ResolveFn<Product> = (route) => {
  const productService = inject(ProductService);
  const productId = route.paramMap.get('id')!;

  return productService.getDetails(productId);
  // The router waits for this Observable/Promise to resolve
};
\`\`\`

---

### 3. Usage in Route Config

You attach guards and resolvers directly to the route definition.

\`\`\`typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Guard logic
    resolve: {
      product: productResolver // Data logic
    }
  }
];
\`\`\`

---

### 4. CanDeactivate (Preventing Data Loss)

This guard is used to check if a user can **leave** a page (e.g., they have unsaved changes in a form).

\`\`\`typescript
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
\`\`\`

---

### 5. Why use Resolvers vs. Fetching in ngOnInit?

| Strategy | User Experience | Coding Complexity |
|----------|-----------------|-------------------|
| **Fetch in Component** | Component loads immediately, shows a "Loading..." spinner | Requires handling "loading" states in the template |
| **Resolver** | Navigation is delayed until data arrives. Page appears fully populated | Cleaner component code; data is available via Input Signals instantly |

> **Pro Tip:** In modern Signal-based apps, the Resource API is often replacing Resolvers for a better "loading" UX, but Resolvers remain the standard for blocking navigations until critical data exists.

---

### 6. Comparison: React

In React Router v6, this is very similar to using \`loader\` (Resolvers) and \`redirect\` (Guards) inside the route definition object.`,
    ['guards', 'resolvers', 'functional'],
    'intermediate'
  ),
  topic(
    'View Transitions',
    `The View Transitions API is a **browser-native** way to create seamless animated transitions between different DOM states. In Angular, this is primarily integrated into the Router. It allows you to animate the transition between two routes (e.g., a "list" view morphing into a "detail" view) with minimal code, replacing the older, more complex \`BrowserAnimationsModule\`.

---

### 1. Enabling View Transitions

Unlike React, where you might use a library like Framer Motion, Angular v17+ has built-in support. You enable it globally in your \`app.config.ts\` within the router configuration.

\`\`\`typescript
import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions() // <--- Enables the native API
    )
  ]
};
\`\`\`

---

### 2. How it Works (Under the Hood)

When you navigate, Angular and the Browser do the following:

1. **Capture:** The browser takes a screenshot of the current state
2. **Update:** The Router performs the navigation and updates the DOM
3. **Capture New:** The browser takes a screenshot of the new state
4. **Cross-fade:** The browser animates between the two screenshots

---

### 3. Hero Animations with view-transition-name

The real power comes from "Hero" animations (moving an element from one page to another). You don't do this in TypeScript; you do it in **CSS**.

If you have an image on Page A and the same image on Page B, give them the same unique \`view-transition-name\`.

**Component A (List):**

\`\`\`html
<img src="avatar.jpg" style="view-transition-name: user-avatar" />
\`\`\`

**Component B (Profile):**

\`\`\`html
<img src="avatar.jpg" style="view-transition-name: user-avatar" />
\`\`\`

The browser will automatically calculate the position/size difference and animate the image sliding and scaling from the list to the profile.

---

### 4. Customizing Transitions in CSS

You can target the transition using pseudo-elements in your global styles:

\`\`\`css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
}

/* Custom animation for a specific named element */
::view-transition-old(user-avatar) {
  opacity: 0;
}
\`\`\`

---

### 5. Advanced: onViewTransitionCreated

If you need to run logic (like scrolling or logic-based animations) during the transition, the \`withViewTransitions\` function accepts an options object with a callback.

\`\`\`typescript
withViewTransitions({
  onViewTransitionCreated: (info) => {
    console.log('Transition started from:', info.from);
    console.log('Transitioning to:', info.to);
  }
})
\`\`\`

---

### 6. Key Differences from React/Vue

| Framework | Approach |
|-----------|----------|
| **React** | Transitions usually require wrapping components in \`<TransitionGroup>\` or using framer-motion's \`layoutId\`. It is JavaScript-heavy |
| **Vue** | Uses the \`<Transition>\` wrapper which is DOM-based but not necessarily using the browser's native View Transition API by default |
| **Angular** | It is Router-integrated. You enable it once, and then use CSS to define which elements "belong" together across routes |`,
    ['transitions', 'animations', 'navigation'],
    'advanced'
  ),
]);

import { category, topic } from '../../utils/topicHelpers';

export const asyncDataResources = category('Async Data & Resources', [
  topic(
    'The Resource API',
    `Introduced in Angular v19 (and stabilized in v20), the \`resource()\` API is the modern, **Signal-based way to handle asynchronous data fetching**. It provides a declarative way to fetch data, track its status (loading, error, success), and automatically re-fetch when its dependencies change.

> In React terms, this is Angular's native version of **TanStack Query (React Query)** or the \`useFetch\` hook in Nuxt/Vue.

---

### 1. Why use resource()?

Previously, Angular developers used \`HttpClient\` combined with RxJS observables and the \`async\` pipe. While powerful, it often led to "boilerplate heavy" code for simple fetches.

**The Resource API:**
- Returns **Signals**, not Observables
- Automatically tracks loading and error states
- Is reactive by default: if a signal used in the request changes, the resource re-fetches

---

### 2. Basic Usage

The \`resource()\` function takes a \`loader\` function that returns a Promise.

\`\`\`typescript
import { resource } from '@angular/core';

export class UserProfile {
  // Simple fetch
  users = resource({
    loader: () => fetch('https://api.example.com/users').then(res => res.json())
  });

  constructor() {
    // Accessing values (all are signals)
    console.log(this.users.value());     // The data
    console.log(this.users.isLoading()); // Boolean
    console.log(this.users.error());     // Error object if any
  }
}
\`\`\`

---

### 3. Reactive Resources (The "React Query" Pattern)

The most powerful feature is passing a \`request\` signal. When the request signal updates, the loader automatically runs again.

\`\`\`typescript
import { Component, signal, resource } from '@angular/core';

@Component({ ... })
export class ProductDetails {
  productId = signal(123);

  productResource = resource({
    // 1. Define the dependencies
    request: () => ({ id: this.productId() }),

    // 2. The loader runs whenever 'request' changes
    loader: ({ request }) => {
      return fetch(\`https://api.example.com/products/\${request.id}\`)
        .then(res => res.json());
    }
  });

  updateProduct() {
    this.productId.set(456); // This automatically triggers a re-fetch!
  }
}
\`\`\`

---

### 4. rxResource (RxJS Interop)

Since Angular's \`HttpClient\` returns Observables, there is a dedicated version called \`rxResource\` that converts an Observable stream into a Resource Signal.

\`\`\`typescript
import { rxResource } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class SearchComponent {
  http = inject(HttpClient);
  query = signal('angular');

  results = rxResource({
    request: () => this.query(),
    loader: (q) => this.http.get(\`https://api.example.com/search?q=\${q}\`)
  });
}
\`\`\`

---

### 5. Template Usage

Because it uses Signals, the template remains clean and does not require the \`async\` pipe.

\`\`\`html
@if (productResource.isLoading()) {
  <p>Loading...</p>
} @else if (productResource.error()) {
  <p>Error loading product.</p>
} @else {
  <div>{{ productResource.value()?.name }}</div>
  <button (click)="productResource.reload()">Refresh Data</button>
}
\`\`\`

---

### Key Differences for React/Vue Devs

| Feature | Angular \`resource()\` | React Equivalent | Vue/Nuxt Equivalent |
|---------|----------------------|------------------|---------------------|
| **Reactivity** | Automatic via Signals | Dependency arrays in \`useEffect\` or \`queryKey\` | Reactive params in \`useFetch\` |
| **State Tracking** | Built-in (\`isLoading\`, \`error\`) | Manual \`useState\` or TanStack Query | Built-in in \`useFetch\`/\`useAsyncData\` |
| **Re-fetching** | \`resource.reload()\` | \`refetch()\` | \`refresh()\` |
| **Data type** | Signal | State/Query Result | Ref |

---

### Summary

The Resource API moves Angular away from the imperative "Service calls Component -> Component subscribes -> Component sets loading state" pattern, toward a **declarative model** where the UI simply reacts to the state of the data fetch.`,
    ['resource', 'httpResource', 'v20'],
    'intermediate'
  ),
  topic(
    'Legacy HTTP Client',
    `The \`HttpClient\` is Angular's built-in service for performing HTTP requests. While the new \`resource\` API is preferred for simple data fetching in Signal-based apps, the \`HttpClient\` remains the powerhouse for complex requests, file uploads, custom headers, and interceptors.

> It is "Legacy" only in the sense that it is Observable-based (RxJS) rather than Signal-based, but it is still the industry standard for Angular networking.

---

### 1. Configuration (Modern Standalone)

In modern Angular (v17+), you no longer import an \`HttpClientModule\`. Instead, you configure it in your \`app.config.ts\` using a provider function.

\`\`\`typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Basic setup
    // provideHttpClient(withInterceptors([authInterceptor])) // Advanced setup
  ]
};
\`\`\`

---

### 2. Basic Usage

You inject the \`HttpClient\` using the \`inject()\` function and call methods like \`get\`, \`post\`, \`put\`, or \`delete\`. These methods return an Observable.

\`\`\`typescript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    // Note: HttpClient is type-safe
    return this.http.get<User[]>('https://api.example.com/users');
  }
}
\`\`\`

---

### 3. "Legacy" vs. "Modern" Consumption

Because \`HttpClient\` returns an Observable, you have two ways to handle the data in a component:

#### The RxJS Way (Traditional)

Using the \`async\` pipe in the template. This handles subscription and unsubscription automatically.

\`\`\`html
@if (users$ | async; as users) {
  @for (user of users; track user.id) {
    <li>{{ user.name }}</li>
  }
}
\`\`\`

#### The Signal Way (Modern Interop)

Converting the Observable into a Signal using \`toSignal\`.

\`\`\`typescript
import { toSignal } from '@angular/core/rxjs-interop';

export class UserList {
  private userService = inject(UserService);

  // Converts the Observable stream into a read-only Signal
  users = toSignal(this.userService.getUsers(), { initialValue: [] });
}
\`\`\`

---

### 4. Interceptors (The "Middleware" of Angular)

One reason the \`HttpClient\` is still essential is **Interceptors**. They allow you to transform outgoing requests (e.g., adding an Auth Token) or incoming responses (e.g., global error handling) globally.

\`\`\`typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = 'YOUR_TOKEN_HERE';

  // Requests are immutable; you must clone them to modify
  const authReq = req.clone({
    setHeaders: { Authorization: \`Bearer \${authToken}\` }
  });

  return next(authReq);
};
\`\`\`

---

### Key Differences for React/Vue Devs

| Feature | Angular HttpClient | fetch (Standard JS) | Axios |
|---------|-------------------|---------------------|-------|
| **Return Type** | Observable (Lazy) | Promise (Eager) | Promise (Eager) |
| **Cancellation** | Automatic on unsubscribe | Requires AbortController | CancelToken |
| **JSON Parsing** | Automatic | Manual (\`res.json()\`) | Automatic |
| **Interceptors** | Built-in via DI | Manual wrapper | Built-in |
| **Testing** | \`HttpTestingController\` | Requires mocking global fetch | Requires axios-mock-adapter |

---

### Pro Tip: Cold Observables

The \`HttpClient\` returns **Cold Observables**. This means the HTTP request does not fire until someone subscribes to it (via \`.subscribe()\` or the \`async\` pipe). If you subscribe twice, the request fires twice. To avoid this, developers often use the \`shareReplay()\` operator.`,
    ['provideHttpClient', 'interceptors', 'http'],
    'intermediate'
  ),
]);

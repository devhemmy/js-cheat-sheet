import { category, topic } from '../../utils/topicHelpers';

export const essentialsReactivity = category('Essentials & Reactivity', [
  topic(
    'Standalone Architecture',
    `Standalone Components are the **default standard in Angular v20**. They eliminate the need for NgModules (the old AppModule wrapper), allowing you to construct an application by directly importing and using components, similar to React or Vue.

### Under the Hood

The Angular compiler looks at the \`imports\` array of a specific component to resolve any HTML tags (selectors) or pipes used in its template. This creates a **localized compilation scope**, making dependencies explicit and tree-shakable.

---

### 1. Bootstrapping the App

Instead of booting a module, you boot the root component directly. Configuration (like Routes and Global Providers) is handled in an \`ApplicationConfig\` object.

**Example (main.ts):**

\`\`\`typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const appConfig = {
  providers: [
    provideRouter(routes), // Global providers go here
    // provideHttpClient(),
    // provideZonelessChangeDetection()
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
\`\`\`

---

### 2. The Imports Array

In a Standalone Component, you must explicitly import dependencies that are used inside that component's template.

> **Note:** In Angular v19/v20, \`standalone: true\` is the default and can be omitted.

**Example:**

\`\`\`typescript
import { Component } from '@angular/core';
import { UserProfileComponent } from './user-profile.component'; // Child component
import { DatePipe } from '@angular/common'; // Built-in Pipe

@Component({
  selector: 'app-root',
  // standalone: true, <--- Defaults to true in v20
  imports: [
    UserProfileComponent, // Allows using <app-user-profile> in template
    DatePipe              // Allows using {{ date | date }} in template
  ],
  template: \`
    <h1>Welcome</h1>
    <app-user-profile />
    <footer>Today is {{ today | date }}</footer>
  \`
})
export class AppComponent {
  today = new Date();
}
\`\`\`

---

### 3. Key Rules & Interop

| Rule | Description |
|------|-------------|
| **Explicit Dependencies** | If you use a component, directive, or pipe in the HTML, it must be in the \`imports\` array |
| **Legacy Interop** | You can import existing NgModules (from 3rd party libraries) directly into a standalone component's \`imports\` array |
| **Tree Shaking** | Because dependencies are explicit, unused code is more easily removed by the build tools (ESBuild) |`,
    ['bootstrapping', 'imports', 'standalone'],
    'beginner'
  ),
  topic(
    'Signals (The Core)',
    `Signals are the **primary mechanism for managing state** in modern Angular. They are reactive wrappers around a value that notify consumers (like templates or other signals) when that value changes.

### Under the Hood

Signals build a **dependency graph**. When a signal is read, it registers the reader as a dependency. When the signal changes, it notifies only its direct dependents. This enables **Fine-Grained Reactivity**, allowing Angular to update only the specific text node or attribute in the DOM that changed, bypassing the need to check the entire component tree (which was the standard in Zone.js).

---

### 1. Writable Signals (\`signal\`)

A Writable Signal holds a value that can be directly modified. It replaces plain class properties for state variables.

- **Create:** Initialize with a default value
- **Read:** Call it as a function \`()\` to get the value
- **Update:** Use \`.set()\` (replace) or \`.update()\` (derive from previous)

\`\`\`typescript
import { Component, signal } from '@angular/core';

@Component({ ... })
export class CounterComponent {
  // Initialize
  count = signal(0);

  // React Equivalent: const [count, setCount] = useState(0);

  increment() {
    // Read value: this.count()
    // Update value:
    this.count.update(value => value + 1);
  }

  reset() {
    // Set value directly
    this.count.set(0);
  }
}
\`\`\`

---

### 2. Computed Signals (\`computed\`)

A Computed Signal derives its value from other signals. It is **read-only**, **lazy** (calculated only when read), and **memoized** (re-calculated only if dependencies change).

> **Automatic Dependency Tracking:** You do not need a dependency array. Angular tracks which signals are accessed inside the callback.

\`\`\`typescript
import { Component, signal, computed } from '@angular/core';

export class CartComponent {
  price = signal(100);
  quantity = signal(2);

  // React Equivalent: const total = useMemo(() => price * quantity, [price, quantity]);
  total = computed(() => this.price() * this.quantity());

  // Note: If 'price' remains 100, accessing 'total()' repeatedly returns the cached value.
}
\`\`\`

---

### 3. Effects (\`effect\`)

Effects are for **side effects** (logging, DOM manipulation, external APIs). They run once initially, and then re-run whenever any signal accessed inside them changes.

- **Injection Context:** Must be created in the constructor or assigned to a field (so it has access to the dependency injection context)
- **Cleanup:** Returns an \`EffectRef\` to manually destroy, though Angular cleans them up automatically when the component destroys

\`\`\`typescript
import { Component, signal, effect } from '@angular/core';

@Component({ ... })
export class LoggerComponent {
  count = signal(0);

  constructor() {
    // React Equivalent: useEffect(() => { console.log(count) }, [count]);
    effect(() => {
      console.log(\`The count is now: \${this.count()}\`);
    });
  }
}
\`\`\`

---

### Key Rules & Gotchas

| Rule | Description |
|------|-------------|
| **Equality Check** | By default, signals use referential equality (\`===\`). If you set a signal to the same value, dependents are not notified |
| **No Glitches** | Signals guarantee "glitch-free" execution. If you update A, and B depends on A, and C depends on B, reading C will always see the fully updated state of the entire graph |
| **Read-Only** | You cannot \`.set()\` or \`.update()\` a computed signal |`,
    ['signal', 'computed', 'effect', 'reactivity'],
    'beginner'
  ),
  topic(
    'Advanced Reactivity',
    `This section covers features that handle complex state relationships and the architectural shift to "Zoneless" applications in Angular v20.

---

### 1. Linked Signals (\`linkedSignal\`)

\`linkedSignal\` is a primitive designed to solve the **"State Reset" pattern**. It creates a writable signal that automatically updates/resets when a dependency (source) changes, but can still be manually modified by the user.

#### The Problem it Solves

In the past (or in React), if you wanted a value to sync with a parent prop initially but allow local edits, you often needed messy \`useEffect\` hooks or \`ngOnChanges\` logic. \`linkedSignal\` handles this declaratively.

#### Key Characteristics

- **Writable:** You can \`.set()\` or \`.update()\` it like a normal signal
- **Dependent:** If the "source" signal changes, the linked signal resets to the computed value defined in the derivation function

#### Example

Imagine a product selector. When the product changes, the quantity should reset to 1. However, the user can manually change the quantity to 5.

\`\`\`typescript
import { Component, signal, linkedSignal } from '@angular/core';

@Component({ ... })
export class OrderComponent {
  // The Source
  selectedProduct = signal({ id: 1, name: 'Laptop' });

  // The Linked Signal
  // 1. If 'selectedProduct' changes, 'quantity' resets to 1.
  // 2. The user can still call this.quantity.set(5).
  quantity = linkedSignal({
    source: this.selectedProduct,
    computation: () => 1
  });

  // Short syntax if source isn't explicitly separated (infers dependencies)
  // quantity = linkedSignal(() => 1);

  changeProduct() {
    // This triggers 'quantity' to reset to 1
    this.selectedProduct.set({ id: 2, name: 'Phone' });
  }

  updateQuantity() {
    // Manually updates quantity to 5.
    // It stays 5 until 'selectedProduct' changes again.
    this.quantity.set(5);
  }
}
\`\`\`

---

### 2. Zoneless Angular

Historically, Angular used a library called **zone.js** to "monkey-patch" browser APIs (like \`setTimeout\`, \`addEventListener\`, \`Promise\`). This allowed Angular to magically know when to run Change Detection (CD) after any event.

#### The Shift in v20

With Signals, Angular knows exactly what changed. It no longer needs to guess. You can disable zone.js entirely for better performance and easier debugging.

#### How to Enable

In your application configuration (\`app.config.ts\`), use the \`provideZonelessChangeDetection\` provider.

\`\`\`typescript
// app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Replaces provideZoneChangeDetection()
    provideZonelessChangeDetection()
  ]
};
\`\`\`

#### Impact on Development

| Aspect | Description |
|--------|-------------|
| **Performance** | No overhead from patching native browser APIs |
| **Async/Await** | In Zone.js, async/await was sometimes tricky because Zone couldn't track it perfectly in older versions. In Zoneless, standard JS async patterns work natively without issues |
| **Change Detection** | Instead of checking the whole tree top-down, Angular only updates the views consuming the specific signal that changed (OnPush behavior becomes the default implicit behavior) |
| **Manual Trigger** | If you are integrating a third-party library that doesn't use Signals, you might need \`ChangeDetectorRef.markForCheck()\` (though this is rare in a fully Signal-based app) |`,
    ['linkedSignal', 'zoneless', 'reactivity'],
    'advanced'
  ),
  topic(
    'RxJS Interop',
    `This feature bridges the gap between **RxJS (Streams/Events)** and **Signals (State)**. Since many Angular APIs (Router, legacy HTTP) still return Observables, these functions are essential for converting data into Signals for easy consumption in the template.

> **Import Path:** \`@angular/core/rxjs-interop\`

---

### 1. Observable to Signal (\`toSignal\`)

Converts an Observable into a read-only Signal.

- **Automatic Subscription:** It automatically subscribes to the Observable immediately
- **Automatic Cleanup:** It automatically unsubscribes when the component (or injection context) is destroyed
- **Removes the Async Pipe:** You no longer need \`{{ stream$ | async }}\` in templates. You just call \`stream()\`

#### Configuration Options

| Option | Description |
|--------|-------------|
| \`initialValue\` | Sets the signal's value before the Observable emits (avoids \`undefined\`) |
| \`requireSync\` | Throws an error if the Observable doesn't emit synchronously immediately (useful for \`BehaviorSubject\`) |

#### Example

\`\`\`typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ ... })
export class UserProfileComponent {
  private http = inject(HttpClient);

  // 1. Fetch data as Observable
  private user$ = this.http.get('/api/user');

  // 2. Convert to Signal
  // 'user' is now a Signal<User | undefined>
  user = toSignal(this.user$);

  // With initial value (no generic Type check needed for undefined)
  // user = toSignal(this.user$, { initialValue: { name: 'Guest' } });

  // In Template:
  // <h1>{{ user()?.name }}</h1>  <-- No '| async' pipe needed
}
\`\`\`

---

### 2. Signal to Observable (\`toObservable\`)

Converts a Signal into an Observable. This is primarily used when you need to leverage powerful RxJS operators (like \`debounceTime\`, \`switchMap\`, or \`distinctUntilChanged\`) on a state change.

> **Asynchronous:** \`toObservable\` is asynchronous. If a signal changes multiple times in a single synchronous tick, the Observable will only emit the final value (glitch-free consistency).

#### Example: Search Debounce

You have a search input (Signal) and want to fetch data (API) only after the user stops typing.

\`\`\`typescript
import { Component, signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs/operators';

@Component({ ... })
export class SearchComponent {
  // 1. The State (Signal)
  query = signal('');

  // 2. React to changes using RxJS operators
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),           // Wait for 300ms pause
      switchMap(q => fetchApi(q))  // Switch to new API call
    ),
    { initialValue: [] }
  );

  updateQuery(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
  }
}
\`\`\`

---

### Key Takeaway for React Developers

| Function | React Equivalent |
|----------|------------------|
| \`toSignal\` | Roughly equivalent to a \`useSubscription\` hook that puts the result into state |
| \`toObservable\` | Allows you to use RxJS as a "useEffect" for complex event orchestration that React struggles with (like handling race conditions in data fetching) |`,
    ['toSignal', 'toObservable', 'rxjs'],
    'intermediate'
  ),
]);

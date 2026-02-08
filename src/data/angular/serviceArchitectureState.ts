import { category, topic } from '../../utils/topicHelpers';

export const serviceArchitectureState = category('Service Architecture & State Management', [
  topic(
    'The Service Blueprint',
    `In Angular, a **Service** is a class responsible for sharing logic, data, or functions across multiple components. While components should focus on the UI and user interaction, Services focus on the "heavy lifting": data fetching, state management, and business logic.

Unlike React, where you might use a Hook or a Context Provider, Angular uses **Dependency Injection (DI)** to manage services.

---

### 1. The Modern Service Structure

In modern Angular, we use the \`inject()\` function and Signals for reactivity within services.

\`\`\`typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Makes this a singleton available everywhere (Tree-shakable)
})
export class UserService {
  private http = inject(HttpClient); // Modern injection (replaces constructor)

  // 1. Private State (Signals)
  private userState = signal<{ name: string; age: number } | null>(null);

  // 2. Public Read-only View
  public user = this.userState.asReadonly();
  public isAuthenticated = computed(() => !!this.user());

  // 3. Logic/Actions
  updateUser(newName: string) {
    this.userState.update(u => u ? { ...u, name: newName } : null);
  }
}
\`\`\`

---

### 2. Dependency Injection: Under the Hood

When you mark a service with \`@Injectable({ providedIn: 'root' })\`, Angular's compiler does two things:

- **Singleton Pattern:** It ensures only one instance of the service is created for the entire application.
- **Tree-shaking:** If your app never actually "injects" this service, the build tool (Esbuild) will completely remove it from the final JavaScript bundle, keeping the app lean.

---

### 3. How to Consume a Service

You no longer need to type out long constructors. Use the \`inject()\` function directly in your component.

\`\`\`typescript
@Component({
  standalone: true,
  template: \\\`
    <h1>Hello, {{ user()?.name }}</h1>
    <button (click)="changeName()">Update</button>
  \\\`
})
export class ProfileComponent {
  private userService = inject(UserService); // Injection happens here

  // Expose the signal to the template
  user = this.userService.user;

  changeName() {
    this.userService.updateUser('Ibrahem');
  }
}
\`\`\`

---

### 4. Singleton vs. Local Scope

| Scope | Behavior |
|-------|----------|
| \`providedIn: 'root'\` | The service is a **Global Singleton**. Every component shares the same data |
| Component-level \`providers\` | If you add the service to a component's \`providers: [MyService]\` array, Angular creates a **new instance** for that component and its children only. When the component is destroyed, the service is destroyed |

---

### 5. Key Differences from React

| Feature | React | Angular |
|---------|-------|---------|
| **Sharing state** | Custom hook (\`useUser\`) + \`ContextProvider\` wrapper | Services with DI (automatic singleton) |
| **Data sharing** | Two components calling the same hook without a provider don't share data—they just share logic | Services **automatically share data** by default (as singletons) |
| **Wiring** | Must wrap UI in "Provider" components | DI system handles the "wiring" in the background |

---

### 6. Best Practices

- **Keep Templates Dumb:** If a component has more than 5 lines of logic in a method, move that logic to a Service.
- **Signals over RxJS:** For simple state (user info, UI toggles), use Signals in your services. Reserve RxJS (Observables) for complex data streams or HTTP polling.
- **Always use \`providedIn: 'root'\`:** Unless you have a very specific reason to create multiple instances of a service.`,
    ['services', 'architecture', 'injectable', 'dependency-injection', 'signals'],
    'intermediate'
  ),
  topic(
    'Global State (Signal Stores)',
    `While a simple Service with a \`signal()\` works for basic state, complex applications need a more structured approach. **Signal Stores** (primarily via the \`@ngrx/signals\` library) represent the modern, functional way to manage global state in Angular.

It replaces the heavy "Boilerplate" of traditional Redux (Actions, Reducers, Effects) with a lightweight, plugin-based architecture that is 100% Signal-based and developer-friendly.

---

### 1. The Signal Store Pattern

A Signal Store is built using features. You "compose" your store by adding state, computed properties, and methods.

\`\`\`typescript
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { TodoService } from './todo.service';

export const TodoStore = signalStore(
  { providedIn: 'root' }, // Makes it a global singleton

  // 1. Initial State
  withState({
    todos: [] as Todo[],
    loading: false,
    filter: 'all' as 'all' | 'completed'
  }),

  // 2. Derived State (Computed Signals)
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const list = todos();
      return filter() === 'completed' ? list.filter(t => t.done) : list;
    }),
    count: computed(() => todos().length)
  })),

  // 3. Logic & Actions
  withMethods((store, todoService = inject(TodoService)) => ({
    async loadAll() {
      patchState(store, { loading: true });
      const todos = await todoService.getAll();
      patchState(store, { todos, loading: false });
    },
    addTodo(title: string) {
      // patchState is the safe way to update multiple signals at once
      patchState(store, (state) => ({
        todos: [...state.todos, { id: Date.now(), title, done: false }]
      }));
    }
  }))
);
\`\`\`

---

### 2. Consuming the Store

The store is injected just like a regular service. Every property in the state automatically becomes a Signal.

\`\`\`typescript
@Component({
  standalone: true,
  // No need to import CommonModule anymore because @for is built-in!
  providers: [TodoStore],
  template: \\\`
    <p>Total: {{ store.count() }}</p>

    // Modern @for with mandatory tracking for performance
    @for (todo of store.filteredTodos(); track todo.id) {
       <div>{{ todo.title }}</div>
    } @empty {
       <p>No todos found.</p>
    }

    <button (click)="store.loadAll()">Refresh</button>
  \\\`
})
export class TodoListComponent {
  readonly store = inject(TodoStore);
}
\`\`\`

---

### 3. Key Concepts: patchState

In React/Redux, you return a new state object. In Angular Signal Stores, you use \`patchState\`.

- It is **type-safe**.
- It performs a **shallow merge** (like React's \`this.setState\`).
- It ensures that all computed signals update **atomically**.

---

### 4. Comparison: Signal Store vs. RxJS Store (Legacy NgRx)

| Feature | Signal Store (Modern) | NgRx Store (Legacy) |
|---------|----------------------|---------------------|
| **Boilerplate** | Very Low (Functional) | High (Actions/Reducers/Selectors) |
| **Reactivity** | Signals (Synchronous) | RxJS (Asynchronous) |
| **Learning Curve** | Gentle | Steep |
| **Tree-shakable** | Yes | Partially |

---

### 5. Key Differences from React

- **React (Zustand):** Very similar to Signal Stores. You define a store and use a hook to access it. However, Zustand doesn't have built-in "Computed" tracking as optimized as Angular Signals.
- **React (Redux Toolkit):** Signal Stores feel like "Slices" but without the need for a central Dispatcher or a Provider wrapping the component tree.

---

### 6. Why Use a Store Instead of a Plain Service?

- **Standardization:** Every developer on your team knows exactly where state, logic, and computed values live.
- **Plugins:** \`@ngrx/signals\` has built-in plugins like \`withEntities\` (for CRUD) and \`withDevTools\` (to see state changes in Redux DevTools).
- **Lifecycle:** Stores have their own hooks (e.g., \`onInit\`, \`onDestroy\`) to start data fetching as soon as the store is instantiated.`,
    ['state-management', 'signals', 'stores', 'ngrx', 'patchState'],
    'intermediate'
  ),
  topic(
    'Cross-Component Communication',
    `Cross-component communication is the strategy for moving data between different parts of the UI tree. In Angular, the "how" depends entirely on the **relationship** between the components (Parent-Child, Sibling, or Distant).

With the shift to Signals, communication has become more "reactive" and less "event-driven."

---

### 1. Parent to Child: Signal Inputs

The most common pattern. A parent passes data down. In modern Angular, we use \`input()\` (Signal-based) instead of the legacy \`@Input()\` decorator.

\`\`\`typescript
// Child Component
export class UserProfileComponent {
  // A read-only signal. Required means the parent MUST provide it.
  name = input.required<string>();
  age = input(0); // Optional signal with default value
}

// Parent Template
<user-profile [name]="'Ibrahem'" [age]="26" />
\`\`\`

> **Why Signals?** You can use \`computed()\` to derive data from inputs automatically without needing \`ngOnChanges\`.

---

### 2. Child to Parent: Signal Outputs

When a child needs to tell a parent something happened (like a click). Modern Angular uses the \`output()\` API.

\`\`\`typescript
// Child Component
export class SearchBarComponent {
  searchChanged = output<string>(); // New Output API

  onType(val: string) {
    this.searchChanged.emit(val);
  }
}

// Parent Template
<search-bar (searchChanged)="handleSearch($event)" />
\`\`\`

---

### 3. Sibling & Distant Communication: The "Service" Pattern

When two components are not related (e.g., a Header and a Sidebar), passing data through props (Prop Drilling) is painful. Instead, we use a **Shared Service** as a "Message Bus."

- Component A updates a Signal in the Service.
- Component B (and any other component) reads that Signal.

\`\`\`typescript
// The "Bridge" Service
@Injectable({ providedIn: 'root' })
export class UIBridgeService {
  sidebarOpen = signal(false);
}

// Component A (Toggle)
export class Header {
  ui = inject(UIBridgeService);
  toggle() { this.ui.sidebarOpen.update(v => !v); }
}

// Component B (Listener)
export class Sidebar {
  isOpen = inject(UIBridgeService).sidebarOpen; // Automatically stays in sync
}
\`\`\`

---

### 4. Direct Component Access: viewChild

Sometimes a parent needs to call a method directly on a child (e.g., triggering an animation or resetting a form).

\`\`\`typescript
export class ParentComponent {
  // Get a signal reference to the child component
  child = viewChild.required(ChildComponent);

  resetChild() {
    this.child().someMethod(); // Access the instance
  }
}
\`\`\`

---

### 5. Key Differences from React

- **React:** Communication is strictly one-way. To talk to a sibling, you must lift state up to the nearest common ancestor or use Context.
- **Angular:** While one-way data flow is encouraged, the Dependency Injection system allows any component to "opt-in" to a shared data stream (Service) without the parent needing to know about it. It's much more flexible for complex, deep UI trees.

---

### 6. Strategy Summary

| Relationship | Recommended Tool |
|-------------|-----------------|
| **Parent → Child** | \`input()\` (Signals) |
| **Child → Parent** | \`output()\` |
| **Sibling / Distant** | Shared Service (with Signals) |
| **Template Content** | \`contentChild\` (Content Projection) |`,
    ['communication', 'services', 'signals', 'input', 'output', 'viewChild'],
    'intermediate'
  ),
  topic(
    'Local vs. Global Scope',
    `In Angular, "Scope" determines the **visibility and lifecycle** of a service. Because of Dependency Injection (DI), you can decide whether a service should be a single shared instance for the entire app (Global) or a private instance tied to a specific part of the UI (Local).

Understanding this is the key to preventing **"state leakage"** where data from one page accidentally shows up on another.

---

### 1. Global Scope (\`providedIn: 'root'\`)

This is the default and most common scope. The service is a **Singleton**.

- **Behavior:** Only one instance is created.
- **Lifecycle:** Created the first time it's injected; lives as long as the app is open.
- **Use Case:** User authentication, Global themes, Configuration, Feature Toggles.

\`\`\`typescript
@Injectable({
  providedIn: 'root' // Global
})
export class AuthService { ... }
\`\`\`

---

### 2. Local Scope (Component-level Providers)

By adding a service to the \`providers\` array of a \`@Component\`, you create a **Local Scope**.

- **Behavior:** Angular creates a new instance specifically for that component and all its children.
- **Lifecycle:** The service is destroyed when the component is removed from the DOM (automatically calling \`ngOnDestroy\` inside the service).
- **Use Case:** A complex "Draft Email" state, a "Search Result" state that should be wiped when you leave the page, or a multi-step wizard.

\`\`\`typescript
@Component({
  standalone: true,
  selector: 'app-checkout',
  providers: [CheckoutService], // New instance for every CheckoutComponent
  template: \\\`...\\\`
})
export class CheckoutComponent {
  // This instance is unique to this specific checkout session
  private checkoutService = inject(CheckoutService);
}
\`\`\`

---

### 3. The Resolution Rules (DI Tree)

When a component asks for a service, Angular looks for it in this order:

1. **Does this component provide it?** If yes, use that.
2. **Does the parent component provide it?** (It searches up the UI tree).
3. **Does the "Root" (App) provide it?**

> If you provide a service at the Component level, you "shadow" (override) the global one for that specific branch of the UI.

---

### 4. Comparison Table

| Feature | Global (\`'root'\`) | Local (\`providers: []\`) |
|---------|-------------------|------------------------|
| **Instance** | Single (Shared) | New per Component |
| **Memory** | Kept until Refresh | Cleaned up when Component dies |
| **Tree-shaking** | Yes (Excellent) | No |
| **Data Persistence** | Permanent | Temporary |

---

### 5. Key Differences from React

- **React:** Similar to the Context API. If you place a \`<Provider>\` at the root, it's global. If you wrap a specific sub-tree with a \`<Provider>\`, only that sub-tree gets that specific instance. However, React requires you to manually wrap the JSX; Angular handles this via the class metadata.
- **Automatic Cleanup:** In Angular, a local service is automatically garbage collected when the component unmounts. In React, you often have to manually clear a global store (like Redux) in a \`useEffect\` cleanup function to avoid stale data.

---

### 6. The "Shared Module" Pitfall

> **Warning:** In older Angular (NgModules), if you imported a module with providers into two different lazy-loaded modules, you might accidentally create two "global" instances.

**Modern Fix:** By using Standalone Components and \`providedIn: 'root'\`, this issue is almost entirely eliminated. You should almost never use \`providers: []\` inside a \`@Component\` unless you explicitly want a fresh state every time that component loads.`,
    ['scope', 'providers', 'injection', 'singleton', 'lifecycle', 'di-tree'],
    'intermediate'
  ),
]);

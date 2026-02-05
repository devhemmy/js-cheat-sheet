import { category, topic } from '../../utils/topicHelpers';

export const dependencyInjection = category('Dependency Injection (DI)', [
  topic(
    'Injection Patterns',
    `Dependency Injection (DI) is a core pillar of Angular. It is a design pattern where a class requests dependencies from external sources rather than creating them itself. In modern Angular (v14+), the way we "inject" these dependencies has shifted from **Constructor Injection** to the **\`inject()\` function**, enabling more flexible and reusable patterns.

---

### 1. The Modern Way: inject() function

Historically, you had to use the constructor to get a service. Now, you can use the \`inject()\` function. This is preferred in modern Angular because it works in "Injection Context" (field initializers, factory functions, etc.).

**Old (Constructor):**

\`\`\`typescript
@Component({...})
export class UserComponent {
  constructor(private userService: UserService) {}
}
\`\`\`

**New (inject):**

\`\`\`typescript
@Component({...})
export class UserComponent {
  // Cleaner, no constructor needed
  private userService = inject(UserService);
}
\`\`\`

---

### 2. Pattern: Functional Guards & Resolvers

Because of \`inject()\`, we no longer need to create classes for Router Guards. We can write them as simple functions.

\`\`\`typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.parseUrl('/login');
};
\`\`\`

---

### 3. Pattern: Component Inheritance Simplification

One of the biggest pain points in React or Class-based Angular was passing dependencies to a \`super()\` constructor. \`inject()\` eliminates this.

**Before:**

\`\`\`typescript
class Base { constructor(protected http: HttpClient) {} }
class Child extends Base {
  constructor(http: HttpClient, private ui: UiService) {
    super(http); // Annoying to pass dependencies up
  }
}
\`\`\`

**After:**

\`\`\`typescript
class Base { protected http = inject(HttpClient); }
class Child extends Base {
  private ui = inject(UiService); // No constructor needed, no super() issues
}
\`\`\`

---

### 4. The providedIn: 'root' Pattern

This is the "Singleton" pattern. By default, services are created once for the entire application. This also makes the service **Tree-shakable** (if you don't use it, it's not included in the final JS bundle).

\`\`\`typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {}
\`\`\`

---

### 5. Advanced: Custom Injection Functions

You can create your own "hook-like" functions that encapsulate logic and dependencies.

\`\`\`typescript
// A reusable "hook" to get current user signals
export function useCurrentUser() {
  const auth = inject(AuthService);
  const api = inject(ApiService);

  return toSignal(api.getUser(auth.userId()));
}

// Inside a component:
readonly user = useCurrentUser();
\`\`\`

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Uses Context API. If you want a service, you must wrap your component tree in a \`<Provider>\`. Dependencies are resolved by looking up the component tree (DOM-bound) |
| **Angular** | Uses a **Hierarchical DI System**. While it can look up the component tree (Element Injectors), it primarily uses a "Module/Environment" injector. This means you can inject things into classes that aren't even components (like Services or Guards), which is much harder to do with React Context without "Prop Drilling" or custom hooks |`,
    ['inject', 'constructor', 'DI'],
    'beginner'
  ),
  topic(
    'Providers',
    `Providers are the "instructions" given to the Dependency Injection (DI) system on **how to create or deliver a dependency**. While the \`@Injectable\` decorator marks a class as available for injection, a Provider determines which actual value or instance is delivered when that dependency is requested.

> Think of it as a key-value map: the **Token** is the key (what you ask for), and the **Provider** is the value/logic (what you actually get).

---

### 1. Types of Providers

Angular provides several ways to satisfy a dependency request:

| Type | Description | Use Case |
|------|-------------|----------|
| **Class Provider** (\`useClass\`) | Tells DI to instantiate a specific class | Swapping a mock service for a real one during testing |
| **Value Provider** (\`useValue\`) | Delivers a static object, string, or configuration | API endpoints, environment flags |
| **Factory Provider** (\`useFactory\`) | Executes a function to create the dependency | Creating a service that needs logic or depends on other services to initialize |
| **Existing Provider** (\`useExisting\`) | Maps one token to another (aliasing) | Narrowing an API surface area |

---

### 2. Provider Scoping (Where to Provide)

Where you define a provider determines the lifetime and visibility of the instance:

| Scope | Description |
|-------|-------------|
| \`providedIn: 'root'\` | The service is a singleton for the whole app. Best for memory and tree-shaking |
| \`bootstrapApplication\` providers | Available globally, but specifically defined in \`app.config.ts\` |
| **Route Providers** | Available only to the route and its children. Great for "Feature-specific" state |
| **Component Providers** | A new instance is created for every single instance of that component. The service is destroyed when the component is destroyed |

---

### 3. Code Example: Factory & Value Providers

\`\`\`typescript
// 1. Defining a Value Provider for Configuration
export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('app.config');

// 2. Defining a Factory
export function loggerFactory() {
  const isDev = inject(ENVIRONMENT_TOKEN);
  return isDev ? new ConsoleLogger() : new FileLogger();
}

// 3. Registering them in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG_TOKEN, useValue: { apiUrl: 'https://api.com' } },
    {
      provide: LoggerService,
      useFactory: loggerFactory,
      deps: [ENVIRONMENT_TOKEN] // Optional if not using inject() inside the factory
    }
  ]
};
\`\`\`

---

### 4. Modern "provideX" Functions

In modern Angular (v15+), instead of the \`{ provide: ... }\` object syntax, the team is moving toward functional "provide" utilities for better readability:

\`\`\`typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // Custom provide function
    provideMyFeatureState()
  ]
};
\`\`\`

---

### 5. Multi-Providers

Sometimes you want a single token to return an **array of values** rather than a single instance. You do this by setting \`multi: true\`. This is how Angular handles things like \`HTTP_INTERCEPTORS\` or \`APP_INITIALIZER\`.

\`\`\`typescript
{ provide: MY_PLUGINS, useValue: PluginA, multi: true },
{ provide: MY_PLUGINS, useValue: PluginB, multi: true }
// Injecting MY_PLUGINS will now give you [PluginA, PluginB]
\`\`\`

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Does not have a built-in DI system. To "provide" something, you use \`Context.Provider\`. If you want to swap an implementation, you have to manually change which value you pass to the \`<Provider value={...}>\` in the JSX tree |
| **Angular** | The DI system is decoupled from the UI. You can swap a service implementation in a config file without touching a single line of your Component's HTML or Logic. This makes Angular much more powerful for Enterprise testing and Design Systems where you might need to mock global behaviors |`,
    ['providedIn', 'factory-providers', 'services'],
    'intermediate'
  ),
  topic(
    'Injection Tokens',
    `In Angular, dependencies are usually identified by their **Class name**. However, sometimes you need to inject something that doesn't have a class, such as an Interface, a string, a configuration object, or a function.

Because TypeScript interfaces are removed during compilation, they don't exist at runtime. **Injection Tokens** act as a unique runtime "key" (or placeholder) that the Dependency Injection system uses to find and deliver these non-class dependencies.

---

### 1. Why not use Strings?

While you can use a string as a token, it is dangerous. If two different developers use the string \`'config'\`, one will overwrite the other. Injection Tokens provide a unique identity that prevents collisions.

\`\`\`typescript
// BAD: Risk of naming collisions
{ provide: 'api_url', useValue: '...' }

// GOOD: Unique and type-safe
export const API_URL = new InjectionToken<string>('Description for debugging');
\`\`\`

---

### 2. Creating and Providing a Token

You define the token, usually in a constants or config file, and then provide it in your \`app.config.ts\` or component.

\`\`\`typescript
// 1. Define
export interface AppConfig {
  theme: 'dark' | 'light';
  retries: number;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// 2. Provide (in app.config.ts)
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: { theme: 'dark', retries: 3 } }
  ]
};
\`\`\`

---

### 3. Consuming the Token

You use the \`inject()\` function or the \`@Inject()\` decorator to retrieve the value associated with the token.

\`\`\`typescript
@Component({...})
export class MyComponent {
  // Type-safe injection
  private config = inject(APP_CONFIG);

  constructor() {
    console.log(this.config.theme); // 'dark'
  }
}
\`\`\`

---

### 4. Self-Providing Tokens (Internal DI)

You can define how a token is created directly inside the token definition. This is useful for "global" constants that don't need to be manually added to a \`providers\` array.

\`\`\`typescript
export const BROWSER_WINDOW = new InjectionToken<Window>('WindowToken', {
  providedIn: 'root',
  factory: () => window
});

// Usage anywhere:
const win = inject(BROWSER_WINDOW);
\`\`\`

---

### 5. Dependency Resolution Modifiers

When using tokens (or classes), you can tell Angular how to look for the dependency using these decorators or inject flags:

| Modifier | Description |
|----------|-------------|
| \`@Optional()\` | If the token isn't found, return \`null\` instead of throwing an error |
| \`@Self()\` | Only look in the current component's providers (don't go up the tree) |
| \`@SkipSelf()\` | Look only in the parents (ignore the current component) |
| \`@Host()\` | Stop looking when you reach the "host" component (the boundary of the current template) |

**Modern Syntax:**

\`\`\`typescript
// Functional approach for the same modifiers
const service = inject(MyService, { optional: true, self: true });
\`\`\`

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | If you want to share a configuration object via Context, you use a Context object (created via \`createContext\`). The Context object is the token |
| **Angular** | The Token is the "Address" and the Provider is the "Value." This separation allows you to have one Address (\`API_URL\`) but deliver different Values (Development URL vs. Production URL) based on the environment, without the component ever knowing the difference |`,
    ['InjectionToken', 'tokens', 'DI'],
    'intermediate'
  ),
]);

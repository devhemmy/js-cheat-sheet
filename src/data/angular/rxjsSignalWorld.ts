import { category, topic } from '../../utils/topicHelpers';

export const rxjsSignalWorld = category('RxJS in a Signal-First World', [
  topic(
    'RxJS vs Signals Strategy',
    `In modern Angular, we are moving toward a **Signal-powered UI** but an **RxJS-powered infrastructure**.

RxJS is no longer the primary way we manage local component state (Signals do that now), but it remains the undisputed king of asynchronous streams, event handling, and complex data orchestration (e.g., debouncing search inputs or polling).

---

### 1. The Golden Rule: State vs. Events

| Use Case | Tool |
|----------|------|
| **Signals** | Synchronous values, UI state, inputs, and derived data (\`computed\`) |
| **RxJS** | HTTP requests, WebSockets, time-based operations (timers), and complex multi-step async logic |

---

### 2. Bridging the Gap (rxjs-interop)

Angular provides two essential utilities to allow Signals and RxJS to communicate seamlessly.

#### toSignal(observable)

Converts an Observable into a Signal. This is how you "bring data home" to the UI.

- It automatically subscribes when the component initializes
- It automatically unsubscribes when the component is destroyed

\`\`\`typescript
import { toSignal } from '@angular/core/rxjs-interop';

// An Observable from a service
users$ = inject(UserService).getUsers();

// A Signal that the template can use
// { initialValue } is often required because Observables might be late
users = toSignal(this.users$, { initialValue: [] });
\`\`\`

#### toObservable(signal)

Converts a Signal into an Observable. This is useful when you want to use RxJS operators (like \`debounceTime\` or \`switchMap\`) on a changing value.

\`\`\`typescript
import { toObservable } from '@angular/core/rxjs-interop';

searchQuery = signal('');
// Convert signal to observable to use debounceTime
query$ = toObservable(this.searchQuery);

results$ = this.query$.pipe(
  debounceTime(300),
  switchMap(query => this.api.search(query))
);

results = toSignal(results$, { initialValue: [] });
\`\`\`

---

### 3. The Pattern: The "Interop Sandwich"

In a signal-first app, you often follow this flow:

1. **Start with a Signal** (e.g., a user typing in an input)
2. **Convert to Observable** (to use operators like \`debounce\`, \`distinctUntilChanged\`)
3. **Perform Async Action** (e.g., \`switchMap\` to an API call)
4. **Convert back to Signal** (to display the result in the UI)

---

### 4. Why not use RxJS for everything anymore?

For React and Vue developers, RxJS often felt "heavy" for simple state.

| Benefit | Description |
|---------|-------------|
| **No manual subscriptions** | Signals don't require \`.subscribe()\` or the \`async\` pipe |
| **Glitch-free execution** | Signals avoid the "diamond problem" (unnecessary double-renders) that RxJS can sometimes encounter in complex dependency graphs |
| **Better Change Detection** | Signals tell Angular exactly what changed, allowing the framework to skip checking the entire component tree (Zoneless Angular) |

---

### Key Takeaway for React Devs

- Think of **Signals** as \`useState\` / \`useMemo\` on steroids (they track dependencies automatically)
- Think of **RxJS** as a powerful version of \`useEffect\` specifically designed for handling streams of data over time`,
    ['rxjs', 'signals', 'strategy'],
    'intermediate'
  ),
  topic(
    'Common Operators',
    `Even in a "Signal-First" Angular world, RxJS remains the gold standard for handling asynchronous streams, race conditions, and time-based events. As a React developer, think of these as the "power tools" for your \`useEffect\` logic—they handle the complex cleanup and timing that Signals aren't designed for.

---

### 1. The "Big Three" Flattening Operators

When you have an Observable that triggers another Observable (like a UI click triggering an HTTP request), you need these to manage the "inner" stream.

| Operator | Behavior | Best Use Case |
|----------|----------|---------------|
| \`switchMap\` | Cancels the previous request if a new one starts | **Search/Autocomplete.** If the user types 'A' then 'B', cancel the 'A' request and only care about 'B' |
| \`mergeMap\` | Lets all requests run concurrently | **Deletes/Updates.** If a user clicks "Delete" on 5 items fast, you want all 5 requests to complete |
| \`exhaustMap\` | Ignores new inputs until the current one finishes | **Login Buttons.** Prevent double-submission if a user mashes the button |

---

### 2. Time-Based Operators

These are used to control the frequency of execution, usually for performance.

| Operator | Description |
|----------|-------------|
| \`debounceTime(ms)\` | Waits for a pause in the stream (e.g., "Wait 300ms after the user stops typing before searching") |
| \`throttleTime(ms)\` | Emits the first value, then ignores everything for the duration (e.g., "Only allow one window resize event every 100ms") |

---

### 3. Utility & Transformation

| Operator | Description |
|----------|-------------|
| \`filter\` | Only lets values through that meet a condition |
| \`map\` | Transforms the data (similar to \`Array.prototype.map\`) |
| \`tap\` | Used for Side Effects. It doesn't change the stream; it just "taps" into it to log data or trigger a notification |
| \`catchError\` | The "Try/Catch" block of RxJS. Essential for preventing an Observable from "dying" when an HTTP request fails |

---

### 4. Comparison: React vs. RxJS

In React, you often handle race conditions manually with a boolean flag or an \`AbortController\`. RxJS does this declaratively.

**React (Manual cleanup):**

\`\`\`javascript
useEffect(() => {
  let active = true;
  fetchData(id).then(data => {
    if (active) setState(data);
  });
  return () => { active = false; }; // Manual cancellation logic
}, [id]);
\`\`\`

**Angular (Declarative with RxJS):**

\`\`\`typescript
// switchMap handles the "active" flag and cancellation automatically
data = toSignal(
  this.id$.pipe(
    switchMap(id => this.http.get(\`/api/data/\${id}\`))
  )
);
\`\`\`

---

### 5. The "Pipe" Syntax

RxJS operators are always used inside the \`.pipe()\` method. Think of it as an assembly line where data flows from the source through each "station" (operator).

\`\`\`typescript
this.searchControl.valueChanges.pipe(
  filter(text => text.length > 2),   // Station 1: Must be > 2 chars
  debounceTime(300),                // Station 2: Wait for pause
  distinctUntilChanged(),           // Station 3: Only if text actually changed
  switchMap(term => this.api.search(term)), // Station 4: API call (cancel old)
  catchError(err => of([]))         // Station 5: Error handling
).subscribe(results => { ... });
\`\`\`

---

### Pro-Tip for Angular v20

While you should learn these, always check if \`rxResource\` or \`computed\` can do the job first. Use RxJS Operators only when you need to manage **Time** (debounce) or **Cancellation Logic** (switchMap).`,
    ['switchMap', 'catchError', 'combineLatest', 'operators'],
    'intermediate'
  ),
]);

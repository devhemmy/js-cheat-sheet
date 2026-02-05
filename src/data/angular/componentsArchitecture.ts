import { category, topic } from '../../utils/topicHelpers';

export const componentsArchitecture = category('Components & Architecture', [
  topic(
    'Component Structure',
    `In Angular, a component is a TypeScript class decorated with \`@Component\`. This decorator defines how the component behaves, how it looks, and what other dependencies (components, directives, pipes) are available to its template.

> **Key Difference from React:** In React, if you import a component at the top of the file, you can use it in JSX. In Angular, importing the file isn't enough; you must explicitly register it in the \`imports\` array of the \`@Component\` decorator to make it available in the HTML template.

---

### The @Component Decorator

**Import Path:** \`@angular/core\`

\`\`\`typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Example dependency
import { UserCard } from './user-card.component'; // Child component

@Component({
  // 1. Selector: The custom HTML tag name (kebab-case).
  // Usage in parent HTML: <app-profile></app-profile>
  selector: 'app-profile',

  // 2. Standalone: Defaults to true in v19+.
  // Marks this as a self-contained component (no NgModule needed).
  standalone: true,

  // 3. Imports: The "Scope" of the Template.
  // ONLY things listed here can be used in the template below.
  imports: [CommonModule, UserCard],

  // 4. Template: HTML structure.
  // Can be inline (\`template: '...'\`) or external file (\`templateUrl: '...'\`).
  template: \`
    <div class="profile-container">
      <h1>User Profile</h1>
      <app-user-card />
    </div>
  \`,

  // 5. Styles: CSS/SCSS.
  // Scoped to this component only (Emulated Shadow DOM).
  // Can be inline (\`styles: ['...']\`) or external (\`styleUrl: '...'\`).
  styles: [\`
    .profile-container { padding: 20px; border: 1px solid #ccc; }
    h1 { color: blue; }
  \`]
})
export class ProfileComponent {
  // Logic goes here (Properties, Methods, Signals)
}
\`\`\`

---

### Key Metadata Properties

| Property | Description |
|----------|-------------|
| \`selector\` | Defines how to instantiate the component in HTML |
| \`imports\` | The context for the template. If you use \`<my-child>\` in the HTML, \`MyChildComponent\` must be in this array |
| \`templateUrl\` vs \`template\` | \`template\`: Short, inline HTML (good for small components). \`templateUrl\`: Path to \`.html\` file (standard for enterprise apps) |
| \`styleUrl\` vs \`styles\` | Styles are encapsulated by default. Styles defined here won't leak out to the global app, nor will they affect child components (unless \`::ng-deep\` is used, which is deprecated, or \`ViewEncapsulation\` is changed) |

#### Selector Variations

| Type | Syntax | Usage |
|------|--------|-------|
| **Standard** | \`'app-name'\` | \`<app-name></app-name>\` |
| **Attribute** (rare) | \`'[app-name]'\` | \`<div app-name></div>\` |`,
    ['metadata', 'selector', 'imports'],
    'beginner'
  ),
  topic(
    'Signal Inputs',
    `**Import Path:** \`@angular/core\`

Signal Inputs are the modern, reactive replacement for the traditional \`@Input()\` decorator. They allow data to flow from a **Parent Component** into a **Child Component**.

### Key Difference from React

| Framework | Behavior |
|-----------|----------|
| **React** | Props are raw values passed into the functional component. If props change, the function re-runs |
| **Angular** | A Signal Input is a function that returns a Signal. When the parent updates the value, the signal notifies dependents (Effects, Computed signals, or the Template) without necessarily re-running the entire component class logic |

---

### Syntax & Usage

#### 1. Optional Input (with default value)

Defined as a property on the class. It holds a default value if the parent doesn't provide one.

\`\`\`typescript
// Child Component
export class UserCard {
  // Define input. Default is 'Guest'.
  // Type is inferred as InputSignal<string>
  userName = input('Guest');
}
\`\`\`

#### 2. Required Input

Enforced at compile-time. If the parent tries to use \`<app-user-card />\` without passing \`[age]\`, the build fails.

\`\`\`typescript
// Child Component
export class UserCard {
  // No default value needed. Type is InputSignal<number>.
  age = input.required<number>();
}
\`\`\`

#### 3. Input Transforms

Allows you to transform the value coming from the parent before it is stored in the signal (similar to a setter, but functional). Common for handling boolean attributes in HTML.

\`\`\`typescript
import { booleanAttribute } from '@angular/core';

export class ToggleButton {
  // Usage: <app-toggle disabled />
  // "disabled" is present as an empty string, but we want a boolean true.
  disabled = input(false, { transform: booleanAttribute });
}
\`\`\`

---

### Accessing Inputs

Since inputs are signals, you read them by calling them as a function.

\`\`\`typescript
// Within the Class (e.g., in a Computed signal)
displayLabel = computed(() => \`User: \${this.userName()} is \${this.age()} years old\`);

// Within the Template (HTML)
// No parenthesis needed in the template for Signal reads (v17+) if utilizing the signal directly,
// BUT typically standard call syntax is used:
<p>Name: {{ userName() }}</p>
\`\`\`

---

### Aliasing (Renaming)

You can expose a different property name to the public API (template) than what is used internally.

\`\`\`typescript
// Internal name: 'internalId'
// Public HTML attribute: 'user-id' -> <app-card [user-id]="123" />
internalId = input.required<string>({ alias: 'user-id' });
\`\`\``,
    ['input', 'input.required', 'transform'],
    'intermediate'
  ),
  topic(
    'Signal Outputs',
    `**Import Path:** \`@angular/core\`

Signal Outputs are the modern replacement for the \`@Output()\` decorator and \`EventEmitter\`. They allow a **Child Component** to send data or notifications up to a **Parent Component**.

### Key Difference from React

| Framework | Behavior |
|-----------|----------|
| **React** | You pass a callback function as a prop (e.g., \`onSave={handleSave}\`). The child calls \`props.onSave(data)\` |
| **Angular** | The child exposes an "Event Emitter". The parent listens to this event in the template syntax using \`(eventName)="handler($event)"\` |

---

### Syntax & Usage

#### 1. Defining an Output

Defined as a property on the class using the \`output()\` function.

\`\`\`typescript
// Child Component
export class DeleteButton {
  // Define the output. Type is OutputEmitterRef<string>
  itemDeleted = output<string>();

  // Also supports void for simple triggers
  cancel = output<void>();

  handleDelete() {
    // Emitting the event to the parent
    this.itemDeleted.emit('item-123');
  }
}
\`\`\`

#### 2. Listening in the Parent (Template)

The parent binds to the output using parentheses \`()\`. The \`$event\` variable holds the emitted data.

\`\`\`html
<!-- Parent Component Template -->
<app-delete-button
  (itemDeleted)="onItemDeleted($event)"
  (cancel)="closeModal()"
/>
\`\`\`

#### 3. Output from Observable (RxJS Interop)

If your event source is an RxJS Observable (e.g., a stream of clicks or websocket messages), you can convert it directly into an Angular Output.

\`\`\`typescript
import { outputFromObservable } from '@angular/core/rxjs-interop';

export class LiveFeed {
  // Assume generic 'messageStream is an Observable
  // This automatically forwards values from the observable to the parent listener
  messageReceived = outputFromObservable(this.messageStream$);
}
\`\`\`

---

### Aliasing

Just like Inputs, you can rename the output for the public API while keeping a different name internally.

\`\`\`typescript
// Internal usage: this.submitEvent.emit()
// Parent HTML usage: <app-form (on-submit)="..." />
submitEvent = output({ alias: 'on-submit' });
\`\`\``,
    ['output', 'outputFromObservable'],
    'intermediate'
  ),
  topic(
    'Model Inputs',
    `**Import Path:** \`@angular/core\`

\`model()\` is a special signal used for **two-way data binding**. It combines the capabilities of an \`input()\` (receiving data from parent) and a Writable Signal (updating data internally and notifying the parent).

### Key Difference from React

| Framework | Behavior |
|-----------|----------|
| **React** | You must manually pass a value prop AND a callback prop to update it (e.g., \`value={val}\` and \`onValueChange={setVal}\`) |
| **Angular** | \`model()\` handles both sides automatically. It creates a writable signal that syncs with the parent |

---

### Syntax & Usage

#### 1. Defining a Model

Defined in the child component. It can have a default value or be required.

\`\`\`typescript
// Child Component (Toggle.ts)
export class ToggleComponent {
  // 1. Optional with default value (false)
  checked = model(false);

  // 2. Required (Parent MUST provide it)
  // user = model.required<User>();

  toggle() {
    // UPDATING: This updates the local signal AND emits an event to the parent
    this.checked.update(c => !c);
  }
}
\`\`\`

#### 2. Parent Usage (Banana-in-a-Box \`[()]\`)

The parent uses the \`[(name)]\` syntax to bind a signal or variable to the child's model.

\`\`\`typescript
// Parent Component (App.ts)
export class App {
  // Parent's own signal
  isAdmin = signal(false);
}
\`\`\`

\`\`\`html
<!-- Parent Template -->
<!-- The parent passes 'isAdmin'.
     When Child calls .update(), 'isAdmin' automatically updates. -->
<app-toggle [(checked)]="isAdmin" />

<!-- You can also use it one-way if you only want to read (binding) -->
<!-- <app-toggle [checked]="isAdmin()" /> -->
\`\`\`

---

### Under the Hood

When you define \`checked = model()\`, Angular automatically generates two things for the template:

| Generated | Purpose |
|-----------|---------|
| **Input:** \`[checked]\` | The read path |
| **Output:** \`(checkedChange)\` | The write path |

This backward compatibility means standard inputs/outputs can still interact with \`model()\` inputs if needed.`,
    ['model', 'two-way-binding'],
    'intermediate'
  ),
  topic(
    'Lifecycle Hooks',
    `**Import Path:** \`@angular/core\`

Angular components go through specific stages: **Creation**, **Rendering**, and **Destruction**. Unlike React's single \`useEffect\` hook, Angular provides specific interfaces (methods) and functions to tap into these moments.

> **Important v20 Shift:** Traditional hooks (\`ngOnInit\`, \`ngOnDestroy\`) are class methods. New rendering hooks (\`afterNextRender\`, \`afterRender\`) are functions called inside the constructor (injection context), designed specifically for SSR safety.

---

### 1. The Core Hooks

#### ngOnInit()

| Aspect | Description |
|--------|-------------|
| **When** | Runs once after Angular has initialized all inputs |
| **Use for** | API calls, initial logic setup |
| **React Equivalent** | \`useEffect(() => { ... }, [])\` (Mount) |

#### ngOnDestroy()

| Aspect | Description |
|--------|-------------|
| **When** | Runs immediately before the component is destroyed |
| **Use for** | Unsubscribing from Observables, clearing timers, closing WebSocket connections |
| **React Equivalent** | \`useEffect(() => { return () => cleanup }, [])\` (Unmount) |

---

### 2. The New Rendering Hooks (SSR Safe)

These replace usages of \`ngAfterViewInit\` when you need to access the DOM manually. They **do not run on the server**, preventing hydration errors.

#### afterNextRender()

| Aspect | Description |
|--------|-------------|
| **When** | Runs once after the next DOM update cycle completes |
| **Use for** | Initializing 3rd-party libraries (Chart.js, Leaflet, Google Maps) that need the DOM element to exist |

#### afterRender()

| Aspect | Description |
|--------|-------------|
| **When** | Runs after every DOM update cycle |
| **Use for** | Synchronizing DOM layout manually (rarely needed) |

---

### Example

\`\`\`typescript
import { Component, OnInit, OnDestroy, afterNextRender, inject, ElementRef, viewChild } from '@angular/core';

@Component({ ... })
export class UserProfileComponent implements OnInit, OnDestroy {
  // Accessing a DOM element (like useRef)
  chartContainer = viewChild<ElementRef>('chartDiv');

  constructor() {
    // NEW: Function-based hook.
    // Safe for Server-Side Rendering (only runs in browser).
    afterNextRender(() => {
      const nativeEl = this.chartContainer()?.nativeElement;
      console.log('DOM is fully painted, safe to draw chart:', nativeEl);
    });
  }

  ngOnInit() {
    console.log('Component Initialized (Inputs are available)');
    // Good place for HTTP calls
  }

  ngOnDestroy() {
    console.log('Component Destroyed (Cleanup)');
    // Clear timers or streams
  }
}
\`\`\`

---

### Why not ngOnChanges?

In modern Angular, \`ngOnChanges\` (used to react to Input changes) is largely obsolete.

- Use \`computed()\` if you need to derive a new value from an input
- Use \`effect()\` if you need to run side effects when an input changes`,
    ['ngOnInit', 'afterNextRender', 'ngOnDestroy'],
    'beginner'
  ),
  topic(
    'Content Projection',
    `**Import Path:** \`@angular/core\` (No import needed for \`<ng-content>\`)

Content Projection allows you to insert HTML or components from a parent into a child component's template. It allows you to build flexible, reusable UI wrappers (like Cards, Modals, or Layouts).

| Framework | Equivalent |
|-----------|------------|
| **React** | \`props.children\` or "Render Props" |
| **Vue** | Slots (\`<slot>\`) |

---

### 1. Single-Slot Projection (Default)

The simplest form acts exactly like \`props.children\`. Any content placed inside the component tags is rendered where \`<ng-content>\` is placed.

**Child (CardComponent):**

\`\`\`html
<div class="card">
  <!-- Content goes here -->
  <ng-content />
</div>
\`\`\`

**Parent Usage:**

\`\`\`html
<app-card>
  <p>This paragraph is projected into the card!</p>
</app-card>
\`\`\`

---

### 2. Multi-Slot Projection (Named Slots)

You can project content into specific areas using the \`select\` attribute. You select content by CSS selectors (class, ID, tag, or attribute).

**Child (PageLayoutComponent):**

\`\`\`html
<header>
  <!-- Only renders elements with the 'header-slot' attribute -->
  <ng-content select="[header-slot]" />
</header>

<main>
  <!-- Renders everything else (catch-all) -->
  <ng-content />
</main>

<footer>
  <!-- Renders elements with class 'footer-content' -->
  <ng-content select=".footer-content" />
</footer>
\`\`\`

**Parent Usage:**

\`\`\`html
<app-page-layout>
  <!-- Goes to header -->
  <h1 header-slot>My Dashboard</h1>

  <!-- Goes to main (default) -->
  <p>Welcome to the main content area.</p>

  <!-- Goes to footer -->
  <div class="footer-content">Copyright 2025</div>
</app-page-layout>
\`\`\`

---

### 3. Conditional Content (Advanced)

If you need to know if content exists before rendering wrappers (e.g., don't render the \`<footer>\` tag if no footer content was passed), \`<ng-content>\` alone isn't enough because it always renders.

For that, you use \`contentChild\` (Signal query) to check presence.

\`\`\`typescript
@Component({ ... })
export class CardComponent {
  // Check if a footer element exists
  hasFooter = contentChild('.footer-content');
}
\`\`\`

\`\`\`html
@if (hasFooter()) {
  <div class="footer-wrapper">
    <ng-content select=".footer-content" />
  </div>
}
\`\`\``,
    ['slots', 'ngProjectAs', 'ng-content'],
    'intermediate'
  ),
]);

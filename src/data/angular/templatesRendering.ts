import { category, topic } from '../../utils/topicHelpers';

export const templatesRendering = category('Templates & Rendering', [
  topic(
    'Control Flow',
    `**Import Path:** None (Built-in to template engine)

Angular v17+ introduced a new, built-in control flow syntax. It replaces the old "structural directives" (\`*ngIf\`, \`*ngFor\`) with a cleaner syntax inspired by JavaScript and Svelte.

| Benefit | Description |
|---------|-------------|
| **Performance** | Faster than the old directives (no runtime overhead of structural directives) |
| **DX** | No need to import \`CommonModule\` or \`NgIf\`/\`NgFor\` |

---

### 1. Conditional Rendering (@if)

Works like a standard JavaScript \`if\` statement.

| Framework | Equivalent |
|-----------|------------|
| **React** | \`{ condition && <Component /> }\` or ternary operators |
| **Old Angular** | \`<div *ngIf="condition; else loading">...</div>\` |

\`\`\`html
@if (isLoggedIn()) {
  <user-dashboard />
} @else if (hasError()) {
  <error-message />
} @else {
  <login-form />
}
\`\`\`

---

### 2. List Rendering (@for)

Iterates over arrays. Crucially, it requires a \`track\` expression (similar to React's \`key\`) to optimize DOM updates.

| Framework | Equivalent |
|-----------|------------|
| **React** | \`items.map(item => <li key={item.id}>{item.name}</li>)\` |

> **Key Feature:** The \`@empty\` block renders automatically if the array is empty.

\`\`\`html
<ul>
  <!-- 'track' is MANDATORY for performance -->
  @for (user of users(); track user.id; let i = $index, c = $count) {
    <li>
      {{ i + 1 }}/{{ c }}: {{ user.name }}
    </li>
  } @empty {
    <li>No users found.</li>
  }
</ul>
\`\`\`

**Built-in variables:** \`$index\`, \`$count\`, \`$first\`, \`$last\`, \`$even\`, \`$odd\`

---

### 3. Switch Case (@switch)

For handling multiple enum states.

\`\`\`html
@switch (userRole()) {
  @case ('admin') {
    <admin-panel />
  }
  @case ('editor') {
    <editor-tools />
  }
  @default {
    <guest-view />
  }
}
\`\`\`

---

### 4. Template Variables (@let)

New in recent versions: Allows you to declare a local variable inside the template. This is useful for storing the result of an expensive pipe or a complex signal calculation so you don't have to repeat it.

\`\`\`html
<!-- Calculate/Async once, use multiple times -->
@let user = userStream$ | async;

@if (user) {
  <h1>Hello, {{ user.name }}</h1>
  <img [src]="user.avatar" />
}
\`\`\``,
    ['@if', '@for', '@switch', '@let'],
    'beginner'
  ),
  topic(
    'Deferrable Views',
    `Deferrable Views (also known as \`@defer\` blocks) allow you to **declaratively lazy-load** components, directives, and pipes within a template. Instead of loading everything upfront, Angular splits the deferred content into a separate JavaScript chunk and only fetches it when a specific trigger condition is met.

> For a React developer, think of this as \`React.lazy()\` + \`Suspense\` on steroids, because the triggers (like "when scrolled into view") are built directly into the template engine.

---

### How it Works

When the Angular compiler encounters a \`@defer\` block, it automatically creates a separate dynamic import for all the components, pipes, and directives used inside that block.

### The Four Blocks

A complete deferrable view consists of four optional stages:

| Block | Purpose |
|-------|---------|
| \`@defer\` | The main content that will be lazy-loaded |
| \`@placeholder\` | Content shown before the trigger is met (e.g., an icon or empty box) |
| \`@loading\` | Content shown during the transition while the JS bundle is being fetched |
| \`@error\` | Content shown if the bundle fails to load |

---

### Basic Usage

\`\`\`html
@defer (on viewport) {
  <large-chart-component />
} @placeholder {
  <div class="placeholder">Chart will load when you scroll here...</div>
} @loading {
  <spinner />
} @error {
  <p>Failed to load the chart.</p>
}
\`\`\`

---

### Triggers: The "When" and "Why"

The power of \`@defer\` lies in its declarative triggers. You can combine multiple triggers using OR logic (comma-separated).

| Trigger | Description |
|---------|-------------|
| \`on idle\` | (Default) Loads the content when the browser reaches an idle state |
| \`on viewport\` | Loads when the placeholder enters the browser viewport (uses Intersection Observer) |
| \`on interaction\` | Loads when the user clicks or types in the placeholder |
| \`on hover\` | Loads when the mouse hovers over the placeholder area |
| \`on timer(ms)\` | Loads after a specific duration |
| \`when [condition]\` | A custom logic trigger (e.g., a Signal or boolean variable) |

---

### Advanced Triggering & Prefetching

You can separate the loading from the rendering by using \`prefetch\`. This allows you to download the code early but only show it when needed.

\`\`\`html
@defer (on interaction; prefetch on idle) {
  <!-- Code downloads in the background, but only renders on click -->
  <heavy-editor />
} @placeholder {
  <button>Click to Open Editor</button>
}
\`\`\`

---

### Key Differences for React/Vue Devs

| Aspect | Description |
|--------|-------------|
| **No Manual Code Splitting** | In React, you must manually wrap components in \`lazy()\`. In Angular, simply putting a component inside a \`@defer\` block handles the code-splitting and chunk creation automatically |
| **Dependency Requirement** | For \`@defer\` to work, the components inside must be Standalone |
| **Layout Shifting** | Always provide a \`@placeholder\` with a similar height to the deferred content to prevent the UI from "jumping" when the content loads |`,
    ['@defer', 'triggers', 'prefetching'],
    'intermediate'
  ),
  topic(
    'Template Syntax',
    `Angular's template syntax extends HTML by allowing you to bind data from your component class directly to the UI. Unlike React's JSX (which is JavaScript that looks like HTML), Angular uses **HTML that is enhanced with special attributes**.

> In modern Angular, templates are highly optimized. When using Signals, the template updates only the specific DOM node where the data changed, rather than re-rendering the entire component tree.

---

### 1. Interpolation (\`{{ }}\`)

Used to display text data from the component class. It converts the expression inside the braces to a string.

\`\`\`typescript
// Component Class
export class UserComponent {
  name = signal('Ibrahem');
}
\`\`\`

\`\`\`html
<!-- Template -->
<h1>Hello, {{ name() }}</h1>
<!-- Note: If using a Signal, we call it as a function in the template -->
\`\`\`

---

### 2. Property Binding (\`[property]\`)

Used to pass data from the component class to an element's property (e.g., \`src\`, \`disabled\`, \`href\`) or to an \`@Input()\` of a child component.

\`\`\`html
<!-- Binding to a native DOM property -->
<button [disabled]="isPending()">Submit</button>

<!-- Binding to a child component input -->
<user-profile [userId]="currentId()" />
\`\`\`

> **React Comparison:** This is equivalent to \`disabled={isPending}\`.

---

### 3. Event Binding (\`(event)\`)

Used to listen for user events (clicks, keystrokes, mouse moves) and call a method in your component class.

\`\`\`html
<button (click)="saveData()">Save</button>

<!-- Passing the event object -->
<input (input)="onUpdate($event)" />
\`\`\`

> **React Comparison:** This is equivalent to \`onClick={saveData}\`.

---

### 4. Two-Way Binding (\`[(target)]\`)

Used primarily in forms to keep the UI and the underlying data model in sync. It is a combination of Property Binding (\`[]\`) and Event Binding (\`()\`).

\`\`\`html
<input [(ngModel)]="username" />
\`\`\`

**Under the hood:** This is "Syntactic Sugar" for:

\`\`\`html
<input [ngModel]="username" (ngModelChange)="username = $event">
\`\`\`

---

### 5. Template Reference Variables (\`#variable\`)

Used to create a reference to a DOM element or an Angular component within the template itself. Think of this as a declarative \`useRef\`.

\`\`\`html
<input #phoneInput type="text" />

<!-- Accessing the value directly in the template -->
<button (click)="callNumber(phoneInput.value)">Call</button>
\`\`\`

---

### Key Differences for React/Vue Devs

| Feature | Angular | React | Vue |
|---------|---------|-------|-----|
| **Logic in HTML** | Directives (\`@if\`, \`@for\`) | JS Expressions (\`map\`, \`&&\`) | Directives (\`v-if\`, \`v-for\`) |
| **Attributes** | Case-sensitive / Bracketed | camelCase (\`className\`) | Directives / Shorthands (\`:\`, \`@\`) |
| **Attributes vs Props** | Strict distinction between DOM properties and HTML attributes | Treated mostly as props | Similar to Angular |
| **Signals** | \`{{ count() }}\` automatically tracks | \`count\` via \`useState\` / \`useSyncExternalStore\` | \`{{ count }}\` automatically unwraps |

> **Pro Tip:** In modern Angular (v18+), because of Signals, you no longer need to worry about "Zones" or manual change detection in templates. If you bind a Signal to a template, Angular knows exactly which DOM element to update when that Signal changes.`,
    ['binding', 'reference-variables', 'template'],
    'beginner'
  ),
  topic(
    'Pipes',
    `Pipes are simple functions used in templates to accept an input value and return a transformed value. They are used for **data formatting** (dates, currencies, strings) without changing the original data in your component class.

In the template, you use the pipe operator (\`|\`).

---

### 1. Built-in Pipes

Angular provides several ready-to-use pipes for common tasks:

| Pipe | Description |
|------|-------------|
| \`date\` | Formats a date object or string (e.g., \`{{ birthday \\| date:'shortDate' }}\`) |
| \`currency\` | Formats numbers as currency (e.g., \`{{ price \\| currency:'EUR' }}\`) |
| \`uppercase\` / \`lowercase\` | Changes string casing |
| \`json\` | Useful for debugging; converts an object into a JSON string to see it in the UI |
| \`async\` | (Legacy but still common) Automatically subscribes to an Observable or Promise and returns the latest value |

---

### 2. Custom Pipes

You can create your own pipes for specific logic. In modern Angular, these are Standalone by default.

**Example: A "Square" Pipe**

\`\`\`typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'square',
  standalone: true
})
export class SquarePipe implements PipeTransform {
  transform(value: number): number {
    return value * value;
  }
}
\`\`\`

**Usage in Template:**

\`\`\`html
<p>The square of 5 is {{ 5 | square }}</p>
<!-- Renders: The square of 5 is 25 -->
\`\`\`

---

### 3. Pure vs. Impure Pipes

This is the most important concept for performance.

| Type | Description |
|------|-------------|
| **Pure Pipes (Default)** | Angular only executes a pure pipe when it detects a *pure change* to the input value. A pure change is a change to a primitive (String, Number, Boolean) or a change in object reference (Array, Object) |
| **Impure Pipes** | Executed during every change detection cycle, regardless of whether the input changed. These are expensive and should be avoided unless necessary (e.g., for filtering an array where the internal items change but the reference stays the same) |

> **React Analogy:** Think of Pure Pipes as a component wrapped in \`React.memo()\`. If the props don't change, it doesn't re-calculate.

---

### 4. Pipes in a Signal-First World

In older Angular, the \`AsyncPipe\` (\`{{ data$ | async }}\`) was the standard way to handle asynchronous data.

**In Modern Angular (v18/v20), we are moving toward Signals:**

| Approach | Description |
|----------|-------------|
| **Old way** | Use \`AsyncPipe\` to handle RxJS Observables |
| **New way** | Convert the Observable to a Signal using \`toSignal(observable$)\` in the component, and then just use the Signal in the template: \`{{ myData() }}\`. This often removes the need for pipes for async handling entirely |

---

### Key Differences for React/Vue Devs

| Concept | Angular Pipes | React Equivalent | Vue Equivalent |
|---------|---------------|------------------|----------------|
| **Data Transformation** | \`{{ val \\| pipe }}\` | Helper functions or \`useMemo\` | Computed properties |
| **Asynchronous Data** | \`AsyncPipe\` | \`useEffect\` + State | \`v-if\` + local state |
| **Performance** | Pure Pipes (cached) | \`useMemo()\` | Computed (cached) |

> **Pro Tip:** Never call a function directly in an Angular template like \`{{ getFormattedDate() }}\`. Why? Because Angular will run that function on every change detection cycle. Instead, use a Pipe or a Signal/Computed, which are optimized and cached.`,
    ['formatting', 'built-in-pipes', 'transform'],
    'beginner'
  ),
  topic(
    'Directives',
    `Directives are classes that add additional behavior to elements in your Angular applications. While Components are technically directives with templates, the term "Directive" usually refers to **Attribute** or **Structural** directives that modify existing DOM elements.

---

### 1. Types of Directives

| Type | Description |
|------|-------------|
| **Components** | Directives with a template |
| **Attribute Directives** | Change the appearance or behavior of an element, component, or another directive (e.g., \`ngClass\`, \`ngStyle\`) |
| **Structural Directives** | Change the DOM layout by adding and removing elements (e.g., the legacy \`*ngIf\` and \`*ngFor\`) |

---

### 2. Attribute Directives

You use attribute directives to "decorate" an element.

**Example: A Custom Highlight Directive**

In modern Angular, we use the \`host\` property or \`HostListener\` to interact with the element the directive is sitting on.

\`\`\`typescript
import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '[style.backgroundColor]': 'color()' // Bind style to a signal input
  }
})
export class HighlightDirective {
  // Signal-based input
  color = input<string>('yellow');

  @HostListener('mouseenter') onMouseEnter() {
    console.log('Hovered!');
  }
}
\`\`\`

**Usage:**

\`\`\`html
<p appHighlight [color]="'cyan'">Hover over me!</p>
\`\`\`

---

### 3. Structural Directives (The "Star" Syntax)

Before the new \`@if\` and \`@for\` Control Flow (v17+), Angular used Structural Directives. You recognize them by the asterisk (\`*\`).

- \`*ngIf\`: Conditionally adds/removes an element
- \`*ngFor\`: Iterates over a list

**Under the Hood:**

The \`*\` is shorthand. Angular transforms \`<div *ngIf="condition">\` into:

\`\`\`html
<ng-template [ngIf]="condition">
  <div>...</div>
</ng-template>
\`\`\`

> **Note for v20:** You should almost always prefer the new Control Flow (\`@if\`, \`@for\`) over structural directives. They are more performant and don't require importing \`CommonModule\`.

---

### 4. Host Elements & Composition

In Modern Angular, instead of just using \`@HostListener\` or \`@HostBinding\` decorators (which are being soft-deprecated in favor of cleaner patterns), we use the \`host\` property in the metadata:

\`\`\`typescript
@Directive({
  selector: '[appSmartClick]',
  standalone: true,
  host: {
    'role': 'button',
    '(click)': 'handleClick($event)',
    '[class.active]': 'isActive()'
  }
})
export class SmartClickDirective {
  isActive = signal(false);
  handleClick(event: Event) { /* logic */ }
}
\`\`\`

---

### 5. Directive Composition API (v15+)

This is a "Superpower" React doesn't have natively. You can apply directives to a component internally without adding them to the HTML.

\`\`\`typescript
@Component({
  selector: 'app-menu',
  standalone: true,
  hostDirectives: [
    {
      directive: HighlightDirective,
      inputs: ['color: highlightColor'], // Map directive input to component input
    }
  ],
  template: \`...\`
})
export class MenuComponent { }
\`\`\`

---

### Key Differences for React/Vue Devs

| Concept | Angular Directives | React Equivalent | Vue Equivalent |
|---------|-------------------|------------------|----------------|
| **Logic Reuse** | Custom Directives | Custom Hooks / HOCs | Custom Directives (\`v-focus\`) |
| **Style/Class** | \`ngClass\` / \`ngStyle\` | \`className\` / style objects | \`:class\` / \`:style\` |
| **Modification** | Direct DOM access via \`ElementRef\` | \`useRef\` + \`useEffect\` | \`ref\` + \`onMounted\` |

---

### Summary

- If you want to change **what** is on the screen, use a **Component**
- If you want to change **how** an existing element behaves (like adding a tooltip, masking an input, or tracking visibility), use a **Directive**`,
    ['host-directives', 'composition-api'],
    'intermediate'
  ),
]);

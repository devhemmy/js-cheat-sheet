import { category, topic } from '../../utils/topicHelpers';

export const stylingTheming = category('Styling & Theming', [
  topic(
    'Component Styles & Encapsulation',
    `Angular features a powerful mechanism called **View Encapsulation**. By default, styles defined in a component's CSS file are "scoped" to that component only. They will not leak out and affect the rest of the application, even if you use generic selectors like \`h1\` or \`.container\`.

---

### 1. View Encapsulation Modes

You can control how Angular handles styling in the \`@Component\` decorator using the \`encapsulation\` property.

#### A. Emulated (Default)

Angular modifies your CSS selectors by adding a unique attribute (e.g., \`_ngcontent-c12\`). This "emulates" the behavior of Shadow DOM without requiring browser support for it.

- **Pros:** Scoped styles, high performance.
- **Cons:** You cannot easily style child components from the parent.

\`\`\`typescript
@Component({
  selector: 'app-user',
  template: \\\`<h1>Hello</h1>\\\`,
  styles: [\\\`h1 { color: red; }\\\`],
  encapsulation: ViewEncapsulation.Emulated // Default
})
\`\`\`

> **Under the hood:** Angular turns your \`h1\` into \`h1[_ngcontent-c12]\`.

#### B. None

Styles are moved to the global \`<head>\` of the document. They are **not scoped**.

- **Pros:** Useful for creating global themes or utility classes.
- **Cons:** High risk of CSS collisions (one component can break the whole app's UI).

#### C. ShadowDom

Angular uses the browser's native Shadow DOM API.

- **Pros:** True encapsulation; even global styles from \`index.html\` won't leak in.
- **Cons:** Limited browser support for older versions; can be tricky to work with third-party libraries.

---

### 2. Best Practices for Modern Angular

In a Signal-first, Standalone world, the best practice is to stay with **Emulated** and use **CSS Variables** for theming.

**Theming with CSS Variables:**

\`\`\`css
/* component.css */
.card {
  /* Use a variable defined in global styles or :root */
  background-color: var(--primary-color, blue);
  border: 1px solid #ccc;
}
\`\`\`

---

### 3. Inline vs. External Styles

You have two choices for where to put your CSS:

- **\`styleUrls\`:** Points to one or more external files. Best for large components.
- **\`styles\`:** An array of strings containing CSS. Best for small, "dumb" components or layout wrappers.

\`\`\`typescript
@Component({
  standalone: true,
  template: \\\`<div class="box"></div>\\\`,
  styles: [\\\`
    .box { width: 100px; height: 100px; background: red; }
  \\\`]
})
\`\`\`

---

### 4. Key Differences from React

- **React (CSS Modules):** Similar concept, but React relies on the build tool (Webpack/Vite) to rename classes (e.g., \`.button_x5k2\`). Angular relies on attribute selectors (\`.button[_ngcontent]\`), meaning your class names stay readable in the inspector.
- **React (Styled Components):** CSS-in-JS is less common in Angular. Angular prefers standard CSS/SASS files to keep the template and logic clean.
- **Scoping:** In React, if you \`import './style.css'\`, it's global by default. In Angular, if you list a file in \`styleUrls\`, it's scoped by default.

---

### 5. Passing Styles Down

Since styles are encapsulated, if you have a \`CardComponent\` and you try to style an \`<h1>\` inside of it from the \`AppComponent\`, it will fail by default. To solve this, you use CSS Shadow Parts (if using ShadowDom) or the \`:host\` selector (covered in the next topic).`,
    [
      'styles',
      'encapsulation',
      'view-encapsulation',
      'shadow-dom',
      'css-variables',
    ],
    'intermediate',
  ),
  topic(
    'The :host & ::ng-deep Selectors',
    `Because Angular uses View Encapsulation, components are isolated bubbles. However, you often need to style the "shell" of the component itself or reach inside a child component (like a third-party UI library) to tweak its appearance. These selectors are the tools for "piercing" or "targeting" those encapsulation boundaries.

---

### 1. The \`:host\` Selector

The \`:host\` selector is used to style the element that represents the component itself (the custom HTML tag, e.g., \`<app-user-card>\`).

- **The Problem:** Normally, a component can only style things inside its template. But what if you want the component to have a border or a specific \`display\` (like \`flex\`)?
- **The Solution:**

\`\`\`css
/* user-card.component.css */
:host {
  display: block;
  border: 1px solid #ccc;
  transition: transform 0.2s;
}

/* Style the host ONLY if it has a specific class */
:host(.active) {
  border-color: blue;
  transform: scale(1.05);
}
\`\`\`

---

### 2. The \`:host-context\` Selector

This is a "look upwards" selector. It styles the component based on a class found in any of its **parent** elements. This is incredibly useful for **Theming**.

\`\`\`css
/* Style the button text red, but ONLY if it's inside a '.dark-theme' container */
:host-context(.dark-theme) button {
  color: red;
}
\`\`\`

> **Note:** This works even if the \`.dark-theme\` class is on the \`<body>\` tag.

---

### 3. \`::ng-deep\` (The Escape Hatch)

\`::ng-deep\` is used to force a style **down** into child components. It completely ignores view encapsulation for that specific rule.

**The Use Case:** You are using a third-party library (like Angular Material or a Chart library). You want to change the color of a button inside their component, but their CSS is encapsulated.

\`\`\`css
/* DANGEROUS: This will leak and become GLOBAL */
::ng-deep .mat-button {
  background: pink;
}

/* CORRECT: Wrap in :host to scope the "deep" pierce to this component only */
:host ::ng-deep .mat-button {
  background: pink;
}
\`\`\`

> **Status:** \`::ng-deep\` is technically "deprecated" by the Angular team because it's a "hack," but there is currently no replacement for it in the CSS spec that works with Emulated encapsulation. It is still used in almost every professional Angular project.

---

### 4. Key Differences from React

- **React:** In React (using CSS Modules), you don't have a \`:host\`. The "root" of your component is just a \`<div>\` you define. To style a child, you either pass a \`className\` prop down or use a global CSS file.
- **Angular:** Angular gives you a dedicated selector to style the custom tag itself (\`:host\`), which keeps your DOM cleaner because you don't need a wrapper \`<div>\` just for styling.

---

### 5. Summary Table

| Selector | Direction | Purpose |
|----------|-----------|---------|
| \`:host\` | Self | Styles the custom tag (the component shell) |
| \`:host-context\` | Upwards | Styles based on parent/ancestor state (Theming) |
| \`::ng-deep\` | Downwards | Pierces encapsulation to style children/3rd party libs |

---

### 6. Best Practice Tip

Avoid using \`::ng-deep\` whenever possible. If you find yourself using it often, it's a sign that:

- Your components are too tightly coupled.
- You should be using **CSS Custom Properties (Variables)** instead.
  - Parent sets: \`--btn-color: red;\`
  - Child uses: \`background: var(--btn-color);\``,
    ['host', 'ng-deep', 'host-context', 'selectors', 'css', 'encapsulation'],
    'intermediate',
  ),
  topic(
    'Dynamic Styling',
    `Dynamic styling refers to changing the appearance of a component at runtime based on state (Signals), user interaction, or data. Angular provides several ways to bind to classes and styles directly in the HTML template, ranging from single-property toggles to complex object maps.

---

### 1. Class Bindings (The Modern Way)

For most cases, you don't need a special directive. You can bind to a class name directly.

**Single Class Toggle:**

\`\`\`html
<!-- If isActive() is true, the 'active' class is added -->
<div [class.active]="isActive()"></div>
\`\`\`

**Full Class String:**

\`\`\`html
<!-- Bind to a string signal that contains multiple classes -->
<div [class]="buttonClasses()"></div>
\`\`\`

---

### 2. Style Bindings

Similar to classes, you can bind to specific CSS properties. Angular even supports unit suffixes (like \`.px\` or \`.rem\`).

\`\`\`html
<!-- Simple property binding -->
<nav [style.background-color]="themeColor()"></nav>

<!-- Binding with units (very clean!) -->
<div [style.width.px]="sidebarWidth()"></div>

<!-- Multi-property binding (using an object) -->
<div [style]="{ color: 'white', fontSize: '20px' }"></div>
\`\`\`

---

### 3. NgClass & NgStyle (Legacy/Multi-logic)

While the direct bindings above are preferred in modern Angular, \`[ngClass]\` and \`[ngStyle]\` are still used when you have complex logic involving multiple toggles simultaneously.

\`\`\`html
<div [ngClass]="{
  'active': isActive(),
  'disabled': isDisabled(),
  'theme-dark': isDarkMode()
}">
  Complex State Item
</div>
\`\`\`

---

### 4. Logic-Heavy Styling (Signal Pattern)

As a Senior Engineer, you should keep your templates clean. If the styling logic gets complex (e.g., "if X and Y but not Z, then use class A"), move the logic into a \`computed\` signal in your TypeScript file.

**TypeScript:**

\`\`\`typescript
export class CardComponent {
  status = input<'active' | 'pending' | 'error'>();

  // Compute the class name once, then bind it
  readonly cardClass = computed(() => {
    switch (this.status()) {
      case 'active': return 'border-green shadow-lg';
      case 'pending': return 'border-yellow animate-pulse';
      case 'error': return 'border-red opacity-50';
      default: return 'border-gray';
    }
  });
}
\`\`\`

**Template:**

\`\`\`html
<div [class]="cardClass()"> ... </div>
\`\`\`

---

### 5. Key Differences from React

- **React:** You usually construct a string manually or use a utility like \`clsx\` or \`classnames\`.
  \`<div className={\\\`btn \${isActive ? 'active' : ''}\\\`}>\`
- **Angular:** The logic is native to the template syntax. You don't need external libraries to toggle classes cleanly. The \`[class.name]="bool"\` syntax is often considered more readable than template literals in JSX.

---

### 6. Performance Note: The "Change Detection" Angle

In modern Angular (v18+), because we are using Signals, dynamic styling is incredibly efficient. When a Signal changes, Angular knows **exactly** which DOM element and which specific property (class or style) needs to be updated. It doesn't have to re-render the whole component tree, making it much faster than the old Zone.js based "full checking."

---

### 7. Summary of Approaches

| Approach | Best For... |
|----------|------------|
| \`[class.name]\` | Toggling a single class based on a boolean |
| \`[style.prop]\` | Changing a single CSS property (like width or color) |
| \`computed()\` | Complex, multi-variable logic (keeps templates clean) |
| \`[ngClass]\` | Mapping an object of multiple boolean-toggled classes |`,
    [
      'ngClass',
      'ngStyle',
      'dynamic',
      'styling',
      'class-binding',
      'signals',
      'computed',
    ],
    'intermediate',
  ),
]);

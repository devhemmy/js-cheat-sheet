import { category, topic } from '../../utils/topicHelpers';

export const testing = category('Testing', [
  topic(
    'Component Harnesses',
    `Component Harnesses (introduced by the Angular CDK) are an implementation of the **Page Object Model (POM)** pattern for unit testing. A harness is a class that lets a test interact with a component through a high-level API, rather than reaching into the component's internal DOM structure (like using \`querySelector\`).

> This makes tests sturdier because they don't break when you change your internal HTML or CSS classes, as long as the component's behavior remains the same.

---

### 1. The Problem: Brittle Tests

In traditional tests, you often see code like this:

\`\`\`typescript
const button = fixture.debugElement.query(By.css('.my-secret-button-class'));
button.nativeElement.click();
\`\`\`

If you rename \`.my-secret-button-class\` to \`.btn-primary\`, your test fails, even though the button still works. This makes refactoring a nightmare.

---

### 2. The Solution: The Harness API

With a harness, you ask the harness to find the element for you. The harness "knows" the internal structure, so your test doesn't have to.

**Example: Testing a Custom Search Component**

\`\`\`typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MySearchHarness } from './my-search.harness';

it('should trigger search when button is clicked', async () => {
  const fixture = TestBed.createComponent(MySearchComponent);
  // Create a loader that "finds" harnesses in the testbed
  const loader = TestbedHarnessEnvironment.loader(fixture);

  // Find the harness for our component
  const searchHarness = await loader.getHarness(MySearchHarness);

  // Use the high-level API provided by the harness
  await searchHarness.setValue('Angular v20');
  await searchHarness.clickSearch();

  expect(await searchHarness.getResultsCount()).toBe(5);
});
\`\`\`

---

### 3. Official Material Harnesses

One of the biggest wins is that Angular Material provides pre-built harnesses for every component. You never have to \`querySelector\` a Material Tab or Select again.

\`\`\`typescript
import { MatSelectHarness } from '@angular/material/select/testing';

const select = await loader.getHarness(MatSelectHarness);
await select.open();
const options = await select.getOptions();
\`\`\`

---

### 4. Why Use Them?

| Benefit | Description |
|---------|-------------|
| **Readability** | Tests look like user stories (\`await select.open()\`) rather than DOM manipulation |
| **Stability** | If the Angular team updates Material's DOM structure in v21, they also update the Harness. Your tests stay green without you changing a single line |
| **Sync vs Async** | Harnesses handle the "waiting" for you. All harness methods return Promises, so you don't have to manually call \`fixture.detectChanges()\` or \`tick()\` as often |

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React (React Testing Library)** | RTL's philosophy is "test like a user." It encourages finding things by label text or ARIA roles (e.g., \`screen.getByRole('button')\`). This is similar in goal to Harnesses |
| **Angular (Harnesses)** | While RTL is general-purpose for any HTML, Angular Harnesses are **Component-Specific**. A Harness is a specific class designed for a specific component. It provides a type-safe, structured API that is even more resilient than role-based searching because it handles complex internal state (like animations or overlays) automatically |`,
    ['harnesses', 'testing', 'components'],
    'intermediate'
  ),
  topic(
    'Testing Signals',
    `Testing Signals is generally **easier than testing Observables** because Signals are synchronous. You don't need to deal with marbles or complex async/await patterns just to check a value. However, testing the side effects (the \`effect()\` function) requires understanding how Angular schedules these updates.

---

### 1. Basic Signal Testing

Testing a writable signal or a computed signal is as simple as calling the function and asserting the return value.

\`\`\`typescript
it('should update the computed signal when the source changes', () => {
  const component = new MyComponent(); // Logic-only test

  expect(component.doubleCount()).toBe(0);

  component.count.set(5);

  // No need for detectChanges() for the logic itself!
  expect(component.doubleCount()).toBe(10);
});
\`\`\`

---

### 2. Testing effect()

Effects are scheduled by the framework to run asynchronously (usually as a microtask). To test them, you must tell Angular to "flush" the scheduled effects so they execute before your assertion.

In modern Angular tests, we use \`TestBed.flushEffects()\`.

\`\`\`typescript
it('should trigger an effect when signal changes', () => {
  const fixture = TestBed.createComponent(MyComponent);
  const component = fixture.componentInstance;

  // Change the signal
  component.count.set(10);

  // Manually trigger the scheduled effects
  TestBed.flushEffects();

  expect(window.localStorage.getItem('count')).toBe('10');
});
\`\`\`

---

### 3. Signals in Templates

If a Signal is used in a template, you still need \`fixture.detectChanges()\` to update the DOM, just like you did with standard variables.

\`\`\`typescript
it('should render the signal value in the HTML', () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.componentInstance.username.set('Ibrahem');

  fixture.detectChanges(); // Updates the DOM

  const el = fixture.nativeElement.querySelector('h1');
  expect(el.textContent).toContain('Ibrahem');
});
\`\`\`

---

### 4. Integration with RxJS (Interops)

When testing \`toSignal(observable$)\`, remember that the signal will stay at its initial value until the observable emits. If the observable is synchronous (like \`of(5)\`), the signal will hold that value immediately.

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React (useState)** | In React, state updates are batched and asynchronous. In a test (using React Testing Library), you often have to use \`waitFor()\` or wrap updates in \`act()\` to ensure the component re-renders |
| **Angular (Signals)** | The **Value update** is immediate/synchronous. The **DOM update** is scheduled (requires \`fixture.detectChanges()\`). The **Effect execution** is scheduled (requires \`TestBed.flushEffects()\`) |

> Angular Signals are more predictable because they don't rely on the "render cycle" to update their internal value—the value changes the moment you call \`.set()\`.`,
    ['signals', 'testing', 'reactivity'],
    'intermediate'
  ),
  topic(
    'Unit & Integration Testing',
    `In modern Angular (v17+), testing has shifted away from heavy, slow simulations towards leaner, more targeted tests. While Jasmine/Karma was the long-time default, the community is rapidly moving toward **Vitest** or **Jest** for speed and **Web Test Runner** for real-browser testing.

> The focus now is on testing Standalone Components and using Provide-style configuration rather than NgModules.

---

### 1. Modern TestBed Configuration

Since we are using Standalone components, we no longer need to declare them in a module. We use \`imports\` for the component and \`providers\` to mock services using the same functional patterns used in \`main.ts\`.

\`\`\`typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyStandaloneComponent], // Import standalone, don't declare
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(), // Mocking HTTP
      { provide: DataService, useValue: mockDataService }
    ]
  }).compileComponents();
});
\`\`\`

---

### 2. Logic-Only vs. DOM Testing

**Logic-Only (Unit):** If you are testing a Service or a Component's TypeScript logic, you don't always need the TestBed. You can just instantiate the class.

\`\`\`typescript
it('should calculate the total', () => {
  const service = new TaxService(); // Simple JS instantiation
  expect(service.calculate(100)).toBe(115);
});
\`\`\`

**Integration (DOM):** Use the \`ComponentFixture\` to interact with the template and ensure the UI responds to state changes.

---

### 3. Testing Asynchronous Code

Angular provides utilities to handle the "Zone.js" magic or the newer zoneless behavior:

| Utility | Description |
|---------|-------------|
| \`fakeAsync\` + \`tick()\` | Allows you to write async tests in a synchronous-looking way by manually controlling time |
| \`waitForAsync\` | Used for tests that require actual background tasks to complete |

\`\`\`typescript
it('should show message after delay', fakeAsync(() => {
  component.triggerMessage();
  tick(5000); // Fast-forward 5 seconds
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Hello!');
}));
\`\`\`

---

### 4. Integration Testing (Component Interaction)

Because Angular is built on Dependency Injection, integration testing often involves checking how a component interacts with its injected services.

| Technique | Description |
|-----------|-------------|
| **Spying** | Use \`jasmine.createSpyObj\` or \`vi.spyOn\` to verify a service method was called when a button was clicked |
| **Input/Output** | Manually setting \`@Input\` signals and subscribing to \`@Output\` event emitters |

---

### 5. Key Differences from React

| Aspect | React | Angular |
|--------|-------|---------|
| **Philosophy** | React Testing Library strongly discourages testing "internals" (state/methods) and insists on testing from the user's perspective (finding text, clicking) | While "User Perspective" testing is preferred (using Harnesses), Angular's architecture makes it very easy to test "Internals" because the Component is a class. You can easily check if a private variable changed or a method was called |
| **Tooling** | React tests almost exclusively run in JSDOM (Node) | Angular tests have historically run in real browsers (Chrome/Firefox via Karma), though it's currently shifting toward the JSDOM/Vitest model for better CI performance |`,
    ['TestBed', 'unit-testing', 'integration'],
    'intermediate'
  ),
]);

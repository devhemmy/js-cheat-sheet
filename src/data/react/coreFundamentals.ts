import { category, topic } from '../../utils/topicHelpers';

export const coreFundamentals = category('Core Fundamentals', [
  topic(
    'JSX',
    `### JSX (JavaScript XML)

JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. Although React can be used without it, most developers prefer the conciseness and readability of JSX.

Under the hood, tools like Babel transpile JSX into regular JavaScript function calls to \`React.createElement()\`.

**Example:**

This JSX code:
\`\`\`jsx
const element = <h1 className="greeting">Hello, world!</h1>;
\`\`\`
Is transpiled into this JavaScript:
\`\`\`js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
\`\`\`

---

#### 1. Key Differences from HTML

While it looks like HTML, JSX has stricter rules.

*   **Single Root Element:** A component must return a single parent element. You can use a \`<div>\` or a Fragment (\`<>...</>\`) to wrap multiple elements.
*   **Closing Tags:** All tags must be closed. Self-closing tags like \`<img>\` must be written as \`<img />\`.
*   **camelCase Attributes:** JSX attributes use camelCase naming conventions instead of standard HTML attribute names. For example, \`class\` becomes \`className\` and \`tabindex\` becomes \`tabIndex\`. This is because \`class\` is a reserved keyword in JavaScript.

---

#### 2. Embedding JavaScript Expressions

You can embed any valid JavaScript expression within JSX by wrapping it in curly braces \`{}\`. This allows you to display dynamic data.

This can be a variable, a function call, or any other expression that resolves to a value.

**Example:**
\`\`\`jsx
const name = 'John Doe';
const element = <h1>Hello, {name}</h1>;
// Renders: <h1>Hello, John Doe</h1>

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Jane',
  lastName: 'Doe'
};

const userElement = <h1>Hello, {formatName(user)}!</h1>;
// Renders: <h1>Hello, Jane Doe!</h1>
\`\`\`

---

#### 3. Attributes in JSX

You can use quotes for string values or curly braces for JavaScript expressions as attributes.

**Example:**
\`\`\`jsx
// String literal
const element1 = <a href="https://www.example.com">Visit our site</a>;

// JavaScript expression
const user = {
  avatarUrl: 'https://www.example.com/avatar.jpg'
};
const element2 = <img src={user.avatarUrl} />;
\`\`\``,
    ['jsx', 'react', 'syntax', 'components'],
    'beginner'
  ),

  topic(
    'Components (Functional vs. Class)',
    `### Components (Functional vs. Class)

Components are the core building blocks of any React application. They are independent, reusable pieces of code that define a part of the user interface. There are two main types: Functional and Class components.

Modern React exclusively uses Functional Components with Hooks. Class components are considered legacy but are still present in older codebases.

---

#### 1. Functional Components

A Functional Component is a simple JavaScript function that accepts an object of properties (\`props\`) as an argument and returns a React element (JSX).

*   **Syntax:** Plain JavaScript function.
*   **State:** Managed using the \`useState\` Hook.
*   **Side Effects:** Handled with the \`useEffect\` Hook (e.g., API calls, subscriptions).
*   **Simplicity:** Less code, easier to read, and no \`this\` keyword to manage.

**Example:**
\`\`\`jsx
import React, { useState } from 'react';

function Greeting(props) {
  const [name, setName] = useState('World');

  return <h1>Hello, {props.message} {name}!</h1>;
}
\`\`\`

---

#### 2. Class Components (Legacy)

A Class Component is an ES6 class that extends \`React.Component\` and must include a \`render()\` method that returns JSX.

*   **Syntax:** ES6 class.
*   **State:** Managed with \`this.state\` and updated with \`this.setState()\`.
*   **Side Effects:** Handled with lifecycle methods like \`componentDidMount()\` and \`componentDidUpdate()\`.
*   **Complexity:** More boilerplate code and requires understanding the \`this\` keyword.

**Example:**
\`\`\`jsx
import React from 'react';

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'World' };
  }

  render() {
    return <h1>Hello, {this.props.message} {this.state.name}!</h1>;
  }
}
\`\`\`

---

#### Quick Comparison

| Feature | Functional Component | Class Component (Legacy) |
| :--- | :--- | :--- |
| **Syntax** | JavaScript function | ES6 class |
| **State** | \`useState()\` Hook | \`this.state\` / \`this.setState()\` |
| **Side Effects** | \`useEffect()\` Hook | Lifecycle Methods |
| **\`this\` Keyword** | Not needed | Required for state and props |
| **Recommendation** | The modern standard | Legacy; avoid in new code |

**Best Practice:** Always use Functional Components with Hooks for new development. They are more concise and align with the current direction of the React library.`,
    ['components', 'functional', 'class', 'react'],
    'beginner'
  ),

  topic(
    'Props',
    `### Props (Properties)

Props are how you pass data from a parent component down to a child component. They are read-only, meaning a child component should never change the props it receives.

Think of them as arguments to a function or attributes to an HTML tag.

---

#### 1. Passing and Accessing Props

You pass props to a component as attributes in JSX. The child component then receives these props as a single object argument.

**Example:**

**Parent Component (App.js)**

The \`App\` component passes a \`name\` and \`message\` prop to the \`Welcome\` component.
\`\`\`jsx
import React from 'react';
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome name="Alice" message="Welcome to React!" />
      <Welcome name="Bob" message="Have a great day." />
    </div>
  );
}

export default App;
\`\`\`

**Child Component (Welcome.js)**

The \`Welcome\` component receives the \`props\` object and uses its values.
\`\`\`jsx
import React from 'react';

// The 'props' object contains 'name' and 'message'
function Welcome(props) {
  return (
    <h1>{props.message}, {props.name}</h1>
  );
}

export default Welcome;
\`\`\`

**Result:**

The screen will display:
\`\`\`
Welcome to React!, Alice
Have a great day., Bob
\`\`\`

---

#### 2. Destructuring Props

To make your code cleaner, it's common to destructure the \`props\` object directly in the function's parameter list.

This avoids repeating \`props.\` everywhere.

**Example (destructured):**
\`\`\`jsx
// Instead of function Welcome(props)
function Welcome({ name, message }) {
  return (
    <h1>{message}, {name}</h1>
  );
}
\`\`\`

---

#### Key Rules of Props

*   **Read-Only:** A component must never modify its own props. All React components must act like pure functions with respect to their props. This is a core principle of React.
*   **Data Flows Down:** Data in props always flows in one direction: from parent to child.

**Best Practice:** Use props to configure and customize child components, making them reusable and dynamic.`,
    ['props', 'react', 'data-flow', 'components'],
    'beginner'
  ),

  topic(
    'State',
    `### State

State is data that a component "owns" and can change over time. Unlike props, which are passed in from a parent, state is managed inside the component itself.

When a component's state changes, React automatically re-renders the component to reflect the new data. This is the core mechanism for creating interactive user interfaces.

---

#### 1. The useState Hook

In modern functional components, you add state using the \`useState\` Hook.

\`useState\` is a function that returns an array with two elements:

*   The current state value.
*   A function to update that value.

**Syntax:**
\`\`\`jsx
import { useState } from 'react';

const [stateVariable, setStateFunction] = useState(initialValue);
\`\`\`

---

#### 2. How State Works

*   **Initialization:** You give \`useState\` an initial value (e.g., a number, string, boolean). This is the value the state will have on the first render.
*   **Reading State:** You use the state variable (\`stateVariable\`) directly in your JSX to display it.
*   **Updating State:** You must use the setter function (\`setStateFunction\`) to change the state. Calling this function tells React that the state has changed and it needs to re-render the component.

> **Important:** Never modify state directly (e.g., \`count = count + 1\`). This will not trigger a re-render and can lead to bugs.

---

#### Example: A Simple Counter

This component has a \`count\` state. Clicking the button calls \`setCount\`, which updates the state and causes the component to re-render with the new count.

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  // 1. Initialize state: 'count' starts at 0
  const [count, setCount] = useState(0);

  function increment() {
    // 3. Update state using the setter function
    setCount(count + 1);
  }

  return (
    <div>
      {/* 2. Read and display the current state */}
      <p>You clicked {count} times</p>
      <button onClick={increment}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

---

#### Key Principles of State

*   **Local and Private:** State is encapsulated within the component that defines it.
*   **Triggers Re-renders:** The only way to update the UI is by changing state.
*   **Asynchronous Updates:** State updates may be batched by React for performance, so you shouldn't rely on the new state value immediately after setting it.`,
    ['state', 'useState', 'react', 'hooks'],
    'beginner'
  ),

  topic(
    'Virtual DOM',
    `### Virtual DOM

The Virtual DOM (VDOM) is a programming concept where a lightweight copy of the real browser DOM is kept in memory and managed by a library like React. It is one of the key reasons for React's high performance.

Instead of directly manipulating the slow browser DOM for every change, React works with this much faster, in-memory representation.

---

#### 1. How It Works: The Reconciliation Process

The process of using the Virtual DOM to update the real DOM is called reconciliation. It follows these steps:

*   **State Change Occurs:** When a component's state or props change, React creates a new Virtual DOM tree.
*   **Diffing:** React then compares this new VDOM tree with the previous one. This comparison process is called "diffing." React's algorithm is highly optimized to find the minimal number of changes between the two trees.
*   **Batch Updates:** React collects all the identified changes and updates the real browser DOM in a single, efficient batch operation.

By updating only the elements that have actually changed, React avoids expensive and unnecessary manipulations of the real DOM.

**In short:**
State changes ➝ New VDOM is created ➝ VDOM is "diffed" with the old one ➝ Minimal changes are applied to the real DOM.

---

#### 2. Why Is This Faster?

Manipulating the real DOM is slow. Every time you change an element, the browser may have to recalculate the layout and repaint the screen ("reflow" and "repaint"), which are computationally expensive operations.

The Virtual DOM is just a JavaScript object, so reading from it and writing to it is incredibly fast. By batching the updates and applying only the necessary changes to the real DOM, React significantly reduces the number of slow browser operations.

---

#### Key Benefits

*   **Performance:** Drastically reduces the number of direct manipulations to the real DOM, making UI updates much faster.
*   **Simplified Development:** Developers can write code declaratively, describing what the UI should look like for a given state, and React handles the complex task of efficiently updating the DOM.
*   **Cross-Platform:** The Virtual DOM is not tied to the browser. This abstraction allows React to be used in other environments, like mobile app development with React Native.`,
    ['virtual-dom', 'react', 'performance', 'reconciliation'],
    'intermediate'
  ),
]);

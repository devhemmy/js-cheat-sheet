import { category, topic } from '../../utils/topicHelpers';

export const lifecycleAndRendering = category('Component Lifecycle & Rendering', [
  topic(
    'Component Lifecycle',
    `### Component Lifecycle

Every React component goes through a lifecycle of events from its creation to its removal from the DOM. This lifecycle is divided into three main phases: Mounting, Updating, and Unmounting.

Understanding the lifecycle allows you to perform actions at specific moments, like fetching data when a component first appears or cleaning up resources before it disappears.

In modern React, the \`useEffect\` Hook is used to handle all lifecycle events in functional components. Class components use specific lifecycle methods, which are now considered legacy.

---

#### 1. Mounting: The Component is Born

This phase occurs when a component is being created and inserted into the DOM for the first time.

*   **What it's for:** Initial setup, fetching data from an API, or setting up subscriptions.
*   **\`useEffect\` Equivalent:** An effect that runs only once. You achieve this with an empty dependency array (\`[]\`).

**Example (\`useEffect\`)**
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  // This runs once, after the component mounts
  useEffect(() => {
    console.log("Component has mounted!");
    // Common use: Fetch initial data
    // fetch('api/data').then(res => setData(res.json()));
  }, []); // Empty array means "run only on mount"

  return <div>My Component</div>;
}
\`\`\`

---

#### 2. Updating: The Component Changes

This phase occurs whenever a component's state or props change, causing it to re-render.

*   **What it's for:** Responding to changes in props or state, and performing side effects only when specific data has changed.
*   **\`useEffect\` Equivalent:** An effect with dependencies. The effect function will re-run only if the values in the dependency array have changed since the last render.

**Example (\`useEffect\`)**
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // This effect runs when the component mounts AND
  // anytime the 'userId' prop changes.
  useEffect(() => {
    console.log(\`User ID changed to: \${userId}. Fetching new data...\`);
    // fetch(\`api/users/\${userId}\`).then(res => setUser(res.json()));
  }, [userId]); // Dependency array watches 'userId' for changes

  return <div>Viewing profile for user {userId}</div>;
}
\`\`\`

---

#### 3. Unmounting: The Component Dies

This is the final phase, where the component is being removed from the DOM.

*   **What it's for:** Cleaning up to prevent memory leaks. This includes canceling timers, stopping API subscriptions, or removing event listeners.
*   **\`useEffect\` Equivalent:** The cleanup function. If you return a function from your \`useEffect\` callback, React will run it right before the component unmounts.

**Example (\`useEffect\`)**
\`\`\`jsx
import React, { useEffect } from 'react';

function Timer() {
  useEffect(() => {
    // Side effect: start a timer
    const intervalId = setInterval(() => {
      console.log('Timer tick...');
    }, 1000);

    // Return a cleanup function
    return () => {
      console.log("Component is unmounting. Clearing timer.");
      clearInterval(intervalId); // This prevents memory leaks
    };
  }, []); // Empty array ensures this runs only on mount and unmount

  return <div>I have a timer running in the console.</div>;
}
\`\`\``,
    ['lifecycle', 'mounting', 'updating', 'unmounting', 'useEffect'],
    'intermediate'
  ),

  topic(
    'Conditional Rendering',
    `### Conditional Rendering

Conditional rendering allows you to display different components or UI elements based on certain conditions. This is how you make your application dynamic—showing a loading spinner, a welcome message for a logged-in user, or an error notification.

In React, you use standard JavaScript syntax to control what gets rendered. The most common approaches are the ternary operator and the logical \`&&\` operator.

---

#### 1. Ternary Operator (\`? :\`) for If-Else Logic

The ternary operator is a compact way to write an if-else statement directly within your JSX. It's best used when you need to render one thing if a condition is true, and a different thing if it's false.

**Syntax:**
\`condition ? (expression_if_true) : (expression_if_false)\`

**Example: User Greeting**
This component shows a "Welcome back!" message if the user is logged in, and a "Please sign in" message otherwise.
\`\`\`jsx
import React from 'react';

function UserGreeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}

// How to use it:
// <UserGreeting isLoggedIn={true} />  // Renders "Welcome back!"
// <UserGreeting isLoggedIn={false} /> // Renders "Please sign in."
\`\`\`

---

#### 2. Logical \`&&\` Operator for If Logic

The logical AND (\`&&\`) operator is a concise way to render an element only if a certain condition is true. If the condition is false, it renders nothing.

This works because in JavaScript, \`true && expression\` always evaluates to \`expression\`, while \`false && expression\` always evaluates to \`false\`. React doesn't render \`false\`, \`null\`, or \`undefined\`.

**Syntax:**
\`condition && (expression_if_true)\`

**Example: Notification Badge**
This component displays a notification count only if there are unread messages.
\`\`\`jsx
import React from 'react';

function Mailbox({ unreadMessages }) {
  const messageCount = unreadMessages.length;

  return (
    <div>
      <h1>Hello!</h1>
      {messageCount > 0 && (
        <h2>
          You have {messageCount} unread messages.
        </h2>
      )}
    </div>
  );
}

// How to use it:
// <Mailbox unreadMessages={['msg1', 'msg2']} /> // Renders the h2
// <Mailbox unreadMessages={[]} />              // Renders only the h1
\`\`\`

---

#### 3. Using \`if\` Statements with Variables

When your logic is too complex for a ternary operator, you can use a standard \`if\` statement to assign a component or JSX to a variable, and then render that variable. This keeps your return statement clean.

**Example: Login/Logout Button**
\`\`\`jsx
import React, { useState } from 'react';

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let button;

  if (isLoggedIn) {
    button = <button onClick={() => setIsLoggedIn(false)}>Logout</button>;
  } else {
    button = <button onClick={() => setIsLoggedIn(true)}>Login</button>;
  }

  return (
    <div>
      {/* Render the button determined by the if statement */}
      {button}
    </div>
  );
}
\`\`\``,
    ['conditional-rendering', 'ternary', 'logical-and', 'react'],
    'beginner'
  ),

  topic(
    'Lists and Keys',
    `### Lists and Keys

To render a dynamic list of elements in React, you typically use JavaScript array methods like \`.map()\` to transform an array of data into an array of JSX elements.

When you do this, you must provide a special prop called \`key\` for each item in the list.

---

#### 1. Rendering Lists with \`.map()\`

The \`.map()\` method is the standard way to render a list. It creates a new array by calling a function on every element in the original array. In React, you use it to map your data array to a component array.

**Example: Rendering a list of numbers**
\`\`\`jsx
import React from 'react';

function NumberList({ numbers }) {
  // Map the array of numbers to an array of <li> elements
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );

  return <ul>{listItems}</ul>;
}

// How to use it:
// const numbers = [1, 2, 3, 4, 5];
// <NumberList numbers={numbers} />
\`\`\`

---

#### 2. The Importance of the \`key\` Prop

A \`key\` is a special string attribute you need to include when creating lists of elements. Keys help React identify which items have changed, are added, or are removed.

*   **What it does:** Keys give each element in a list a stable identity. This allows React's diffing algorithm to quickly and efficiently track items between re-renders.
*   **Why it's needed:** Without keys, React may have to re-render the entire list if its order changes, which is inefficient and can lead to bugs with component state.

**Rules for Keys:**

*   **Unique Among Siblings:** Keys only need to be unique among their siblings in the same array. They don't have to be globally unique.
*   **Stable and Predictable:** A key should not change between renders. The best keys are unique and stable IDs from your data (like a database ID, \`user.id\`, \`product.sku\`).

**Example: Using data IDs as keys**
\`\`\`jsx
const todos = [
  { id: 'abc', text: 'Learn React' },
  { id: 'def', text: 'Build a project' },
];

const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
\`\`\`

---

#### 3. Why You Should Avoid Using the Array Index as a \`key\`

Using the array index as a key is an anti-pattern, especially if the list can be reordered, filtered, or have items added/removed from the beginning or middle.

\`key={index}\`

*   **The Problem:** The index of an item is not stable. If you add a new item to the beginning of the array, all the following items get a new index. React sees the changed key and can get confused, leading to incorrect UI rendering and state management issues.

*   **When is index as a key acceptable?**
    It's only safe if all of the following are true:
    *   The list is static and will never change.
    *   The items in the list have no unique IDs.
    *   The list will never be reordered or filtered.

**Best Practice:** Always use a stable, unique ID from your data as the key. If you don't have one, you should consider adding one (e.g., using a library like \`uuid\`).`,
    ['lists', 'keys', 'map', 'rendering', 'react'],
    'beginner'
  ),
]);

import { category, topic } from '../../utils/topicHelpers';

export const hooks = category('Hooks', [
  topic(
    'useState',
    `### \`useState\` Hook

The \`useState\` Hook is the most fundamental and commonly used Hook in React. It allows you to add a state variable to your functional components.

It provides a way for your component to "remember" information between renders. When the state changes, React re-renders the component.

---

#### 1. How to Use \`useState\`

First, you import it from React. Then, you call it inside your functional component to create a single piece of state.

\`useState(initialState)\` takes one argument: the initial value of the state.

It returns an array containing two elements:

*   The current state value.
*   The setter function to update this value.

You typically use array destructuring to get these two values.

**Syntax:**
\`\`\`jsx
import React, { useState } from 'react';

const [state, setState] = useState(initialValue);
\`\`\`

---

#### 2. Example: A Simple Toggle

This component uses \`useState\` to manage a boolean \`isOn\` state. Clicking the button calls the \`setIsOn\` function, which updates the state and triggers a re-render.

\`\`\`jsx
import React, { useState } from 'react';

function ToggleSwitch() {
  // 1. Declare state variable 'isOn', initialized to 'false'
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    // 3. Use the setter function to update the state
    setIsOn(!isOn);
  };

  return (
    <div>
      {/* 2. Read the state value to determine what to display */}
      <p>The switch is {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={handleToggle}>
        Toggle
      </button>
    </div>
  );
}
\`\`\`

---

#### 3. Updating State Based on the Previous State

If your new state depends on the previous state value, you should pass a function to the setter. This function receives the previous state as an argument and returns the new state.

This is the safest way to update state and avoids potential bugs caused by asynchronous updates.

**The Wrong Way (can be buggy):**
\`\`\`jsx
function increment() {
  // If React batches updates, 'count' might not be the latest value here
  setCount(count + 1);
}
\`\`\`

**The Correct Way (using a function):**
\`\`\`jsx
function increment() {
  // This guarantees 'prevCount' is the latest state value
  setCount(prevCount => prevCount + 1);
}
\`\`\`
This is especially important when you have multiple state updates in the same function.

---

#### 4. Rules of \`useState\`

*   **Only call Hooks at the top level:** Don't call \`useState\` inside loops, conditions, or nested functions.
*   **Only call Hooks from React functions:** Call them from your functional components, not regular JavaScript functions.
*   **State updates are batched:** React may group multiple \`setState\` calls into a single re-render for better performance.`,
    ['useState', 'hooks', 'state', 'react'],
    'beginner'
  ),

  topic(
    'useEffect',
    `### \`useEffect\` Hook

The \`useEffect\` Hook lets you perform side effects in functional components. Side effects are operations that interact with the "outside world," meaning anything that isn't directly related to calculating what to render.

Common examples include fetching data, setting up timers or subscriptions, and manually changing the DOM. \`useEffect\` combines the functionality of \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` from older class components.

---

#### 1. How to Use \`useEffect\`

You call \`useEffect\` at the top level of your component. It takes two arguments:

1.  A setup function where you put your side effect logic.
2.  An optional dependency array, which controls when the effect is re-run.

**Syntax:**
\`\`\`jsx
import React, { useEffect } from 'react';

useEffect(() => {
  // Your side effect logic goes here.

  // Optional: return a cleanup function.
  return () => {
    // Cleanup logic goes here.
  };
}, [dependencies]);
\`\`\`

---

#### 2. The Dependency Array

The dependency array is crucial for controlling the behavior of your effect.

*   **No dependency array:** The effect runs after every single render. This is often inefficient and can cause infinite loops.
    \`\`\`jsx
    useEffect(() => {
      // Runs on mount and every re-render
    });
    \`\`\`

*   **Empty dependency array (\`[]\`):** The effect runs only once, right after the component mounts for the first time. This is perfect for initial data fetching or setup.
    \`\`\`jsx
    useEffect(() => {
      // Runs only on mount
    }, []);
    \`\`\`

*   **Array with values (\`[prop, state]\`):** The effect runs on mount and then only when any value in the array changes between renders. This lets you re-run logic (like fetching new data) when a specific prop or state variable changes.
    \`\`\`jsx
    useEffect(() => {
      // Runs on mount and whenever 'userId' changes
      fetch(\`/api/users/\${userId}\`);
    }, [userId]);
    \`\`\`

---

#### 3. The Cleanup Function

To prevent memory leaks, you can return a function from your effect. This is the cleanup function. React will run it:

*   Before the component unmounts (is removed from the screen).
*   Before re-running the effect due to a dependency change.

This is essential for canceling timers, unsubscribing from data sources, or removing event listeners.

**Example: A Timer**
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Side effect: set up the interval
    const intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup: clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // [] means this effect runs once on mount

  return <h1>{seconds} seconds have passed.</h1>;
}
\`\`\``,
    ['useEffect', 'hooks', 'side-effects', 'lifecycle', 'react'],
    'intermediate'
  ),

  topic(
    'useContext',
    `### \`useContext\` Hook

The \`useContext\` Hook provides a way to pass data through the component tree without having to pass props down manually at every level. It's designed to solve the problem of "prop drilling."

**Prop Drilling:** When you have a deeply nested component that needs data from a component far up the tree, you have to pass that data as props through all the intermediate components, even if they don't use it. This can become very cumbersome.

\`useContext\` allows a parent component to make data available to any component in the tree below it, no matter how deep.

---

#### How to Use \`useContext\` (in 3 steps)

1.  **Create a Context:** First, create a context object using \`React.createContext()\`. You can provide a default value, which is used when a component is not wrapped in a provider.
2.  **Provide the Context:** Wrap your parent component (or the part of your app that needs the data) with the context's \`Provider\` component. The provider accepts a \`value\` prop, which is the data you want to share.
3.  **Consume the Context:** In any child component that needs access to the data, call the \`useContext()\` Hook with the context object you created.

---

#### Example: A Simple Theme Switcher

**Step 1: Create the Context (\`ThemeContext.js\`)**
This file creates and exports the context.
\`\`\`jsx
import { createContext } from 'react';

// The context can have any default value. Here, it's 'light'.
export const ThemeContext = createContext('light');
\`\`\`

**Step 2: Provide the Context (\`App.js\`)**
The \`App\` component provides the theme value to all components inside the \`ThemeContext.Provider\`. Any child component can now access this value.
\`\`\`jsx
import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import Toolbar from './Toolbar';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    // Any component inside this provider can access the 'theme' value
    <ThemeContext.Provider value={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

export default App;
\`\`\`

**Step 3: Consume the Context (\`Toolbar.js\`)**
The \`Toolbar\` component uses \`useContext\` to read the current theme value directly from the provider, without needing it passed as a prop.
\`\`\`jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Toolbar() {
  // Use the useContext hook to get the current value from the provider
  const theme = useContext(ThemeContext);

  const style = {
    background: theme === 'dark' ? '#333' : '#FFF',
    color: theme === 'dark' ? '#FFF' : '#333',
    padding: '20px',
    margin: '20px 0'
  };

  return (
    <div style={style}>
      Current theme is: {theme}
    </div>
  );
}

export default Toolbar;
\`\`\`

**Result:** The \`Toolbar\` component's background and text color will change when the "Toggle Theme" button is clicked, even though \`App\` never passed \`theme\` to it as a prop.`,
    ['useContext', 'context', 'hooks', 'prop-drilling', 'react'],
    'intermediate'
  ),

  topic(
    'useReducer',
    `### \`useReducer\` Hook

The \`useReducer\` Hook is an alternative to \`useState\` for managing a component's state. It is generally preferred when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

\`useReducer\` follows the "reducer" pattern from functional programming (and libraries like Redux). Instead of updating state directly, you dispatch "actions" that describe what happened, and a "reducer function" handles the state logic.

---

#### 1. When to Use \`useReducer\` vs. \`useState\`

*   Use \`useState\` for simple state, like a boolean, a string, or a number.
*   Use \`useReducer\` when:
    *   State logic is complex and involves several operations.
    *   The state is an object or array with multiple related values.
    *   The next state depends on the previous state in a non-trivial way.
    *   You want to optimize performance for components that trigger deep updates.

---

#### 2. How to Use \`useReducer\`

You call \`useReducer\` with a reducer function and an initial state.

It returns an array with two elements:

*   The current state.
*   A dispatch function to send actions to the reducer.

**Syntax:**
\`\`\`jsx
import { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

---

#### 3. The Reducer Function

A reducer is a pure function that takes two arguments: the current state and an action object. It calculates and returns the next state.

An action is an object that describes what happened. It usually has a \`type\` property (a string) and an optional \`payload\` (the data).

**Syntax:**
\`\`\`javascript
function reducer(state, action) {
  switch (action.type) {
    case 'ACTION_TYPE_1':
      return { ...state, /* new state values */ };
    case 'ACTION_TYPE_2':
      return { ...state, /* other new values */ };
    default:
      return state;
  }
}
\`\`\`

---

#### Example: A Counter with Increment, Decrement, and Reset

This shows how \`useReducer\` can centralize all state logic.

**1. Define the reducer and initial state:**
\`\`\`javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}
\`\`\`

**2. Use \`useReducer\` in the component:**
\`\`\`jsx
import React, { useReducer } from 'react';

// (Reducer function and initialState from above)

function Counter() {
  // state will be { count: 0 } initially
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Count: {state.count}</h1>
      {/* Dispatch actions on user events */}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
\`\`\`

**How it works:**

*   The component displays \`state.count\`.
*   When a button is clicked, it calls \`dispatch\` with an action object (e.g., \`{ type: 'increment' }\`).
*   React sends this action to your reducer function along with the current state.
*   The reducer calculates the new state based on the action's type and returns it.
*   React re-renders the component with the new state.`,
    ['useReducer', 'hooks', 'state', 'reducer', 'react'],
    'intermediate'
  ),

  topic(
    'Custom Hooks',
    `### Custom Hooks

A Custom Hook is a reusable JavaScript function whose name starts with "use" and that can call other Hooks (like \`useState\` or \`useEffect\`).

They are a core feature of modern React for sharing stateful logic between components without changing your component hierarchy. Instead of using complex patterns like Higher-Order Components (HOCs) or Render Props, you can extract component logic into a simple, reusable function.

---

#### 1. Why Create a Custom Hook?

Imagine you have several components that all need to perform the same logic, such as:

*   Fetching data from an API.
*   Subscribing to a browser event (like window resize).
*   Managing a complex form state.
*   Reading from or writing to \`localStorage\`.

Instead of duplicating this logic in every component, you can extract it into a custom Hook and reuse it easily.

---

#### 2. Creating a Custom Hook

A custom Hook is just a function. The key is that it can use other Hooks internally.

**Example: Creating a \`useDocumentTitle\` Hook**
Let's create a custom hook that updates the browser's document title. This is a common side effect.

**The Logic (inside a component):**
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // This is the logic we want to reuse
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click me</button>;
}
\`\`\`

**Step 1: Extract the logic into a \`use...\` function.**
We create a new file \`useDocumentTitle.js\`. The function takes the title as an argument.
\`\`\`javascript
// useDocumentTitle.js
import { useEffect } from 'react';

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]); // Re-run the effect only if the title changes
}

export default useDocumentTitle;
\`\`\`

**Step 2: Use the custom Hook in your component.**
Now, the component becomes much simpler. It just calls the custom Hook to handle the side effect.
\`\`\`jsx
import React, { useState } from 'react';
import useDocumentTitle from './useDocumentTitle';

function Counter() {
  const [count, setCount] = useState(0);

  // Use our custom Hook to manage the document title
  useDocumentTitle(\`You clicked \${count} times\`);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

---

#### 3. Another Example: \`useFetch\`

A very common use case is a hook to fetch data. This hook can manage the data, loading state, and error state.
\`\`\`javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url]); // Re-fetch if the URL changes

  // Return the state for the component to use
  return { data, loading, error };
}
\`\`\`

**How to use it:**
\`\`\`jsx
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(\`/api/users/\${userId}\`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <div>{data.name}</div>;
}
\`\`\`

**Key Takeaway:** Custom Hooks let you build your own library of reusable, stateful logic that can be easily shared across your entire application, making your components cleaner and more focused on their rendering task.`,
    ['custom-hooks', 'hooks', 'reusability', 'react'],
    'intermediate'
  ),
]);

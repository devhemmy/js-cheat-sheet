import { category, topic } from '../../utils/topicHelpers';

export const stateManagement = category('State Management', [
  topic(
    'Lifting State Up',
    `### Lifting State Up

"Lifting state up" is a common pattern in React for managing state that needs to be shared between multiple components. Instead of each component keeping its own local state, you move the state up to their closest common ancestor.

This parent component then becomes the single "source of truth" for that data. It passes the state down to the child components via props, along with functions to update it. This ensures all components are always in sync, reflecting the same data.

---

#### 1. The Problem: Sibling Components Can't Communicate

React's data flow is unidirectional (top-down). A parent can pass data to a child via props, but sibling components cannot directly share state or communicate with each other.

Imagine a temperature calculator with two inputs: one for Celsius and one for Fahrenheit. If you type a value in the Celsius input, the Fahrenheit input should update, and vice versa. If each input manages its own state, they have no way of knowing about each other's changes.

---

#### 2. The Solution: Lifting the State

To solve this, you identify the shared state (the current temperature) and move it to the closest common ancestor component (\`Calculator\`).

The process involves a few steps:

*   **Identify the shared state:** Determine what data multiple components need to access or modify.
*   **Find the common ancestor:** Locate the nearest parent component that contains all the components needing the state.
*   **Move the state:** Remove the local state from the child components and add it to the parent using \`useState\`.
*   **Pass state down as props:** The parent passes the state value down to the children.
*   **Pass update functions down as props:** The parent also passes down the function that updates its state (the setter from \`useState\`), allowing the children to trigger updates in the parent.

---

#### Example: Temperature Calculator

**Before (State is local and not synced):**
Each \`TemperatureInput\` has its own \`temperature\` state. They are independent and don't update each other.
\`\`\`jsx
function TemperatureInput() {
  const [temperature, setTemperature] = useState('');
  // ... render input
}

function Calculator() {
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  );
}
\`\`\`

**After (State is lifted up):**
The state is moved to the \`Calculator\` component.

**Parent Component (\`Calculator.js\`)**
\`\`\`jsx
import React, { useState } from 'react';
import TemperatureInput from './TemperatureInput';

function Calculator() {
  // State is lifted here. It is the single source of truth.
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const handleCelsiusChange = (temp) => {
    setTemperature(temp);
    setScale('c');
  };

  const handleFahrenheitChange = (temp) => {
    setTemperature(temp);
    setScale('f');
  };

  // Convert the temperature for the other input
  const celsius = scale === 'f' ? (temperature - 32) * 5 / 9 : temperature;
  const fahrenheit = scale === 'c' ? (temperature * 9 / 5) + 32 : temperature;

  return (
    <div>
      {/* Pass the state and the update function down as props */}
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange} />

      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange} />
    </div>
  );
}
\`\`\`

**Child Component (\`TemperatureInput.js\`)**
The child now receives its value and the function to change it from props. It has no local state of its own.
\`\`\`jsx
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  const handleChange = (e) => {
    // Calls the parent's update function
    onTemperatureChange(e.target.value);
  };

  return (
    <fieldset>
      <legend>Enter temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:</legend>
      {/* The value comes from props */}
      <input value={temperature} onChange={handleChange} />
    </fieldset>
  );
}
\`\`\`
Now, when you type in one input, it calls the handler function in the \`Calculator\`. The \`Calculator\` updates its state, and then re-renders both \`TemperatureInput\` components with the new, converted values, keeping them perfectly in sync.`,
    ['lifting-state', 'state', 'props', 'data-flow', 'react'],
    'intermediate'
  ),

  topic(
    'Context API',
    `### Context API

The Context API is React's built-in solution for managing global state. It allows you to share state across the entire app (or a large part of it) without "prop drilling"—the tedious process of passing props down through many levels of components.

Think of it as creating a global data store that any component can subscribe to.

---

#### 1. When to Use Context

Context is designed for data that is considered "global" for a tree of React components, such as:

*   **UI Theming:** Sharing a theme (e.g., 'dark' or 'light') with all components.
*   **User Authentication:** Making the current user's data available everywhere.
*   **Application Settings:** Sharing language preferences or other user settings.
*   **Complex State:** When combined with \`useReducer\`, it can act as a lightweight alternative to state management libraries like Redux.

> **Important:** Context is not a replacement for passing props. For data that is only needed by a few nested components, "lifting state up" is often a simpler and better solution.

---

#### 2. How It Works

Using the Context API involves three main steps, which were covered in the \`useContext\` section:

*   **\`React.createContext()\`:** You create a Context object. This object is what components will subscribe to.
    \`\`\`javascript
    export const AuthContext = React.createContext(null);
    \`\`\`

*   **\`<Context.Provider>\`:** You use the \`Provider\` component to wrap a part of your component tree. It accepts a \`value\` prop, which is the data you want to make available to all components underneath it.
    \`\`\`jsx
    // In your main App or layout component
    <AuthContext.Provider value={{ currentUser: user }}>
      <MyApp />
    </AuthContext.Provider>
    \`\`\`

*   **\`useContext(MyContext)\`:** Any functional component within the provider's tree can now access the shared value by using the \`useContext\` Hook.
    \`\`\`jsx
    import { useContext } from 'react';
    import { AuthContext } from './AuthContext';

    function UserAvatar() {
      const { currentUser } = useContext(AuthContext);

      if (!currentUser) return null;

      return <img src={currentUser.avatarUrl} alt={currentUser.name} />;
    }
    \`\`\`

---

#### Key Characteristics

*   **Avoids Prop Drilling:** Its primary purpose is to make data accessible to deeply nested components without passing it through every intermediate component.
*   **Performance:** React re-renders all components that consume a context whenever the provider's \`value\` prop changes. This can lead to performance issues if the value changes frequently or the data is very large. For high-frequency updates, other state management solutions might be more suitable.
*   **Decouples Components:** Components no longer need to know where the data comes from; they just ask for it from the context. This makes them more reusable.`,
    ['context-api', 'state', 'global-state', 'prop-drilling', 'react'],
    'intermediate'
  ),

  topic(
    'State Management Libraries (Redux, Zustand)',
    `### State Management Libraries (Redux, Zustand)

When an application's state becomes complex and is needed by many components, passing props can become difficult. State management libraries provide a centralized store to hold the application's state, making it accessible from anywhere.

While dozens of these libraries exist, the two most prominent approaches are represented by Redux and Zustand.

---

#### 1. Redux

Redux has long been the most popular state management library for large-scale applications. It enforces a strict, predictable pattern for updating state.

*   **Single Source of Truth:** The entire state of your application is stored in a single object tree called the "store."
*   **Unidirectional Data Flow:** The flow of data is strict and follows a clear pattern:
    *   **Action:** A plain object describing what happened (e.g., \`{ type: 'ADD_TODO', payload: 'Learn Redux' }\`).
    *   **Dispatch:** An action is dispatched from a component to the store.
    *   **Reducer:** A pure function takes the previous state and an action, and returns the next state.
*   **Redux Toolkit (RTK):** Modern Redux is used with Redux Toolkit, which greatly simplifies the setup, reduces boilerplate, and includes powerful tools like \`createSlice\` to auto-generate actions and reducers.

**When to use it:** Redux is ideal for large, complex enterprise applications where predictability, debugging (with time-travel), and a strict structure are critical.

**Example (\`createSlice\` from Redux Toolkit):**
\`\`\`jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
\`\`\`

---

#### 2. Zustand

Zustand is a small, fast, and scalable state management library that has surged in popularity due to its simplicity and minimal boilerplate. It uses a modern, hook-based API that feels more native to React.

*   **Minimal API:** Create a store with a single function. There are no reducers, actions, or dispatchers to set up.
*   **Hook-based:** Your store is a custom hook. You simply call this hook in any component to access and modify the state.
*   **No Providers:** Unlike Context API or Redux, Zustand does not require you to wrap your application in a provider component.
*   **Performance:** It automatically prevents unnecessary re-renders by letting components subscribe to specific slices of the state.

**When to use it:** Zustand is an excellent choice for small to large applications, especially when developer experience and speed are priorities. It is often considered the versatile "sweet spot" for many modern projects.

**Example:**
\`\`\`jsx
import { create } from 'zustand';

// 1. Create the store (which is a hook)
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 2. Use the hook in any component
function Counter() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
\`\`\``,
    ['redux', 'zustand', 'state-management', 'global-state', 'react'],
    'advanced'
  ),
]);

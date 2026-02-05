import { category, topic } from '../../utils/topicHelpers';

export const routingAndForms = category('Routing and Forms', [
  topic(
    'React Router',
    `### React Router

React Router is the standard library for handling navigation in a React application. It allows you to build a single-page application (SPA) with multiple views or pages, managing the synchronization between the URL in the browser and the components being displayed.

Instead of the browser making a new request to the server to fetch a new HTML page, React Router intercepts the navigation and dynamically renders the appropriate component for that URL without a full page refresh.

---

#### Core Components of React Router

To implement routing, you primarily work with four main components from the \`react-router-dom\` package.

*   **\`<BrowserRouter>\`**
    This component should wrap your entire application (or at least the part of it that needs routing). It uses the HTML5 History API to keep your UI in sync with the URL, allowing for clean URLs without a hash (\`#\`).
    \`\`\`jsx
    // In your index.js or App.js
    import { BrowserRouter } from 'react-router-dom';

    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root')
    );
    \`\`\`

*   **\`<Routes>\`**
    This component acts as a container that holds all of your individual \`<Route>\` definitions. It intelligently looks through its children \`<Route>\` elements and renders the one whose path best matches the current URL.

*   **\`<Route>\`**
    This is the most important component. It maps a specific URL path to a React component. It has two main props:
    *   \`path\`: A string that defines the URL path (e.g., \`/about\`, \`/users/:id\`).
    *   \`element\`: The component that should be rendered when the URL matches the path.
    \`\`\`jsx
    import { Routes, Route } from 'react-router-dom';
    import Home from './pages/Home';
    import About from './pages/About';

    function App() {
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      );
    }
    \`\`\`

*   **\`<Link>\`**
    This component is used to create navigation links. It is the equivalent of an HTML \`<a>\` tag, but it's aware of the router. When you click a \`<Link>\`, it prevents a full page reload and instead just updates the URL, allowing the \`<Routes>\` component to render the new page.
    \`\`\`jsx
    import { Link } from 'react-router-dom';

    function Navbar() {
      return (
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      );
    }
    \`\`\`
Together, these components provide a declarative and powerful way to manage navigation and create a seamless user experience in a React application.`,
    ['react-router', 'routing', 'navigation', 'spa', 'react'],
    'intermediate'
  ),

  topic(
    'Controlled vs. Uncontrolled Components',
    `### Controlled vs. Uncontrolled Components

In React, there are two main techniques for managing form inputs like \`<input>\`, \`<textarea>\`, and \`<select>\`: controlled components and uncontrolled components. The difference lies in where the data, or "state," of the form element is stored.

---

#### 1. Controlled Components

A controlled component is an input element whose value is controlled by React state. This is the standard, recommended approach for handling forms in React.

**How it works:**

*   A state variable is created using \`useState\` to hold the value of the input.
*   The input's \`value\` prop is set to this state variable.
*   An \`onChange\` event handler is used to call the state's setter function, updating the state every time the user types.

This creates a "single source of truth." The React state and the input field are always in sync.

**Example:**
\`\`\`jsx
import React, { useState } from 'react';

function ControlledForm() {
  // 1. State is the source of truth
  const [name, setName] = useState('');

  const handleChange = (event) => {
    // 3. onChange updates the state
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(\`A name was submitted: \${name}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      {/* 2. The input's value is tied to the state */}
      <input type="text" value={name} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

**Pros:**

*   The component has immediate access to the input's value.
*   Allows for instant validation or formatting on every keystroke.
*   Enables conditional logic (e.g., disabling a button if the input is empty).

---

#### 2. Uncontrolled Components

An uncontrolled component is an input element where the form data is handled by the DOM itself, just like in traditional HTML. React does not manage the input's value.

**How it works:**

*   Instead of using state, you use a \`ref\` (created with the \`useRef\` Hook) to get a direct reference to the DOM element.
*   To get the input's value, you access \`ref.current.value\`, typically inside a submit handler.

**Example:**
\`\`\`jsx
import React, { useRef } from 'react';

function UncontrolledForm() {
  // 1. Create a ref to access the DOM element
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 2. Access the value directly from the DOM via the ref
    alert(\`A name was submitted: \${inputRef.current.value}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

**Pros:**

*   Less code for simple forms where you only need the value on submission.
*   Easier to integrate with non-React libraries that might manipulate the DOM.
*   The \`<input type="file" />\` element is always uncontrolled.

---

#### Quick Comparison

| Feature                 | Controlled Component | Uncontrolled Component          |
| :---------------------- | :------------------- | :------------------------------ |
| **Source of Truth**     | React State (\`useState\`) | The DOM                         |
| **Get the Value**       | Value is always in the state variable | Pull the value from a ref when needed |
| **Data Flow**           | State dictates the input's value | The DOM holds the value internally |
| **Use Case**            | Most forms, complex validation | Simple forms, file inputs, legacy code |

**Best Practice:**
Use controlled components by default. They provide more control and fit better with the declarative nature of React. Uncontrolled components are a useful alternative for simpler scenarios or specific edge cases.`,
    ['forms', 'controlled', 'uncontrolled', 'inputs', 'react'],
    'intermediate'
  ),
]);

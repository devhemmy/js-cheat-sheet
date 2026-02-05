import { category, topic } from '../../utils/topicHelpers';

export const advancedConcepts = category('Advanced Concepts', [
  topic(
    'Higher-Order Components (HOCs)',
    `### Higher-Order Components (HOCs)

A Higher-Order Component (HOC) is a function that takes a component as an argument and returns a new, enhanced component. It's an advanced React pattern for reusing component logic.

> **Note:** HOCs are a powerful pattern, but they have been largely replaced in modern React by custom Hooks. Custom Hooks typically offer a simpler and more direct way to share logic. You will still encounter HOCs in older codebases and some libraries.

---

#### 1. How HOCs Work

The core idea is to wrap a component to give it extra functionality or props. Instead of modifying the original component, a HOC composes it by placing it inside a container. This allows you to inject logic without duplicating code.

Common use cases include:

*   **Conditional rendering:** Showing a loader while data is fetching or checking if a user is authenticated.
*   **Injecting props:** Providing data from a global source, like a theme or user information.
*   **Abstracting state:** Managing shared stateful logic, such as toggling visibility.

---

#### 2. Creating a HOC

A HOC is a function that follows this structure:
\`const enhancedComponent = higherOrderComponent(WrappedComponent);\`

**Example: A \`withLoading\` HOC**
Let's create a HOC that displays a "Loading..." message until a component has its data.

**Step 1: Create the HOC function.**
The \`withLoading\` function takes a component (\`WrappedComponent\`) as an argument and returns a new component. This new component checks for an \`isLoading\` prop. If true, it renders a loading message. Otherwise, it renders the \`WrappedComponent\` with all its original props.
\`\`\`jsx
// withLoading.js
function withLoading(WrappedComponent) {
  return function ComponentWithLoading({ isLoading, ...props }) {
    if (isLoading) {
      return <p>Loading...</p>;
    }
    // Pass remaining props through to the original component
    return <WrappedComponent {...props} />;
  };
}

export default withLoading;
\`\`\`

**Step 2: Apply the HOC to a component.**
Now, you can wrap any component that needs this loading logic.
\`\`\`jsx
import React from 'react';
import withLoading from './withLoading';

// A simple component that displays a list of users
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Create the new, enhanced component by wrapping UserList with the HOC
const UserListWithLoading = withLoading(UserList);

export default UserListWithLoading;
\`\`\`

**Step 3: Use the enhanced component.**
In your main app, you can use \`UserListWithLoading\`. The loading logic is handled by the HOC based on the \`isLoading\` prop you pass to it.
\`\`\`jsx
// App.js
import React, { useState, useEffect } from 'react';
import UserListWithLoading from './UserListWithLoading';

function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
      setUsers([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <UserListWithLoading isLoading={loading} users={users} />
    </div>
  );
}
\`\`\`
For the first two seconds, the screen will show "Loading...". After that, the \`UserList\` will render with the fetched data. The \`UserList\` component itself remains simple and unaware of any loading logic.`,
    ['hoc', 'higher-order-components', 'patterns', 'react'],
    'advanced'
  ),

  topic(
    'Render Props',
    `### Render Props

A Render Prop is a technique for sharing code between React components using a prop whose value is a function. A component with a render prop doesn't implement its own rendering logic. Instead, it calls the function provided in its prop to know what to render.

This pattern inverts control: the component that has the state or logic (the container) delegates the rendering of its output to the component that uses it.

> **Note:** Like HOCs, the Render Props pattern is now less common in modern React. Custom Hooks are generally a simpler and more direct way to achieve the same goal of logic reuse.

---

#### 1. How Render Props Work

The key idea is that one of your component's props is a function. This function takes arguments (usually state from the component) and returns JSX. The component's only job is to manage its internal state and then call this function with that state as arguments.

The prop doesn't have to be named \`render\`. Any prop that is a function and is used to render JSX is a render prop. A very common pattern is to use the \`children\` prop this way, which allows for a cleaner syntax.

---

#### 2. Example: A \`MouseTracker\` Component

Let's build a component that tracks the mouse's X and Y coordinates and uses a render prop to display them. This allows the \`MouseTracker\` to be reused to render anything based on the mouse position.

**Step 1: Create the component with a render prop.**
The \`MouseTracker\` component manages the state (\`coords\`) and the event listeners. Instead of rendering anything itself, it calls \`this.props.render(this.state.coords)\`, passing its state to the render function.
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function MouseTracker({ render }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCoords({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Call the render prop with the current state
  return render(coords);
}

export default MouseTracker;
\`\`\`

**Step 2: Use the component.**
Now, when you use \`<MouseTracker>\`, you provide a function as the \`render\` prop. This function receives the \`coords\` object and decides how to display it.
\`\`\`jsx
import React from 'react';
import MouseTracker from './MouseTracker';

function App() {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <MouseTracker
        render={(coords) => (
          // This JSX is what gets rendered
          <p>The mouse position is {coords.x}, {coords.y}</p>
        )}
      />

      {/* Another use case for the same component */}
      <MouseTracker
        render={(coords) => (
          <div style={{
            height: '20px',
            width: '20px',
            background: 'blue',
            borderRadius: '50%',
            position: 'absolute',
            left: coords.x,
            top: coords.y,
            transform: 'translate(-50%, -50%)'
          }} />
        )}
      />
    </div>
  );
}
\`\`\`
This approach successfully separates the stateful logic (tracking the mouse) from the rendering logic (displaying coordinates or a blue dot), making the \`MouseTracker\` highly reusable.`,
    ['render-props', 'patterns', 'react'],
    'advanced'
  ),

  topic(
    'Memoization (React.memo, useMemo, useCallback)',
    `### Memoization (\`React.memo\`, \`useMemo\`, \`useCallback\`)

Memoization is a performance optimization technique used to speed up applications by caching the results of expensive function calls and returning the cached result when the same inputs occur again.

In React, re-rendering components is a normal process, but it can become slow if it happens too often or involves complex calculations. Memoization helps you prevent unnecessary re-renders and re-calculations. There are three main APIs for this: \`React.memo\`, \`useMemo\`, and \`useCallback\`.

---

#### 1. \`React.memo\`: Memoizing Components

\`React.memo\` is a higher-order component (HOC) that prevents a functional component from re-rendering if its props have not changed.

**How it works:** When a parent component re-renders, React will normally re-render all of its children. \`React.memo\` wraps around a child component and performs a shallow comparison of its current props and its next props. If they are the same, React skips re-rendering the component and reuses the last rendered result.

**Use case:** Best for pure functional components that render the same output given the same props. It is especially useful for components in a list that might re-render when a sibling changes.

**Example:**
Imagine a \`User\` component that receives a \`name\` prop. If the parent re-renders but the \`name\` prop stays the same, we don't need to re-render \`User\`.
\`\`\`jsx
import React from 'react';

// This component will only re-render if its 'name' prop changes.
const User = React.memo(function User({ name }) {
  console.log(\`Rendering User: \${name}\`);
  return <p>Hello, {name}</p>;
});

export default User;
\`\`\`

---

#### 2. \`useMemo\`: Memoizing Values

The \`useMemo\` Hook caches the result of a calculation between re-renders.

**How it works:** You provide \`useMemo\` with a function that performs an expensive calculation and a dependency array. \`useMemo\` will only re-run the calculation if one of the dependencies has changed. Otherwise, it returns the cached value from the last render.

**Use case:** Perfect for optimizing expensive computations, like filtering a large list or performing complex data transformations.

**Example:**
This component filters a large list. Without \`useMemo\`, the filtering would happen on every single render, even if the \`users\` or \`query\` haven't changed.
\`\`\`jsx
import React, { useMemo } from 'react';

function UserList({ users, query }) {
  // This expensive filtering only re-runs if 'users' or 'query' change.
  const filteredUsers = useMemo(() => {
    console.log('Filtering users...');
    return users.filter(user => user.name.includes(query));
  }, [users, query]);

  return (
    <ul>
      {filteredUsers.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
\`\`\`

---

#### 3. \`useCallback\`: Memoizing Functions

The \`useCallback\` Hook caches a function definition between re-renders.

**How it works:** When a component re-renders, any functions defined inside it are re-created. This is usually fine, but if you pass that function as a prop to a child component wrapped in \`React.memo\`, the child will re-render because it sees a "new" function every time. \`useCallback\` returns the same function instance as long as its dependencies haven't changed.

**Use case:** Primarily used to optimize child components that rely on referential equality (like \`React.memo\`). It ensures that prop functions don't trigger unnecessary re-renders in children.

**Example:**
Here, the \`AnalyticsButton\` is memoized. If we passed \`handleClick\` directly, it would be a new function on every render of \`Dashboard\`, causing \`AnalyticsButton\` to re-render. \`useCallback\` prevents this.
\`\`\`jsx
import React, { useState, useCallback } from 'react';

const AnalyticsButton = React.memo(({ onClick }) => {
  console.log("Rendering AnalyticsButton");
  return <button onClick={onClick}>Send Analytics</button>;
});

function Dashboard() {
  const [count, setCount] = useState(0);

  // This function is now memoized and won't be recreated on every render.
  const handleClick = useCallback(() => {
    console.log("Sending analytics...");
    // ...analytics logic
  }, []); // Empty array means the function is created only once

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <AnalyticsButton onClick={handleClick} />
    </div>
  );
}
\`\`\``,
    ['memoization', 'react-memo', 'useMemo', 'useCallback', 'performance', 'react'],
    'intermediate'
  ),

  topic(
    'Error Boundaries',
    `### Error Boundaries

An Error Boundary is a special React component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

Without an error boundary, a single JavaScript error in a part of the UI would break the entire React application, showing a white screen. Error boundaries allow you to gracefully handle these errors and keep the rest of your application interactive.

---

#### 1. How They Work

Error boundaries are class components that define one or both of the following lifecycle methods:

*   \`static getDerivedStateFromError(error)\`: This method is called during the "render" phase after a descendant component throws an error. It should return an object to update the component's state, which allows you to trigger a fallback UI on the next render.
*   \`componentDidCatch(error, errorInfo)\`: This method is called during the "commit" phase. It is used for side effects, like logging the error to an external service (e.g., Sentry, LogRocket).

> **Important:** As of now, there is no Hook equivalent for error boundaries. You must use a class component to create one.

---

#### 2. Creating an Error Boundary

Here is a typical example of an \`ErrorBoundary\` component.
\`\`\`jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // The state property 'hasError' will determine which UI to render.
    this.state = { hasError: false };
  }

  // 1. Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 2. Log the error to an error reporting service.
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    // If an error was caught, render the fallback UI.
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    // Otherwise, render the children as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;
\`\`\`

---

#### 3. How to Use It

You simply wrap any part of your application that you want to protect. You can place it at the top level of your app or around specific, independent widgets.
\`\`\`jsx
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import BuggyComponent from './BuggyComponent'; // A component that might throw an error

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <hr />
      <ErrorBoundary>
        <p>This content is inside the boundary.</p>
        <BuggyComponent />
      </ErrorBoundary>
      <hr />
      <p>This content is outside the boundary and will still render.</p>
    </div>
  );
}
\`\`\`
If \`BuggyComponent\` throws an error, the "Something went wrong" message will be displayed in its place, but the "My Application" title and the content outside the boundary will remain visible and functional.

---

#### Limitations

Error boundaries do not catch errors in:

*   Event handlers (use a \`try...catch\` block inside the handler).
*   Asynchronous code (like \`setTimeout\` or \`requestAnimationFrame\` callbacks).
*   Server-side rendering.
*   The error boundary component itself.`,
    ['error-boundaries', 'error-handling', 'react'],
    'intermediate'
  ),

  topic(
    'Portals',
    `### Portals

React Portals provide a first-class way to render a component into a DOM node that exists outside the direct parent-child hierarchy of the React component tree.

Normally, a component's JSX is rendered as a child of its parent's DOM node. Portals allow a component to "break out" of its container, which is essential for UI elements that need to appear on top of everything else, like modals, tooltips, and notifications.

---

#### 1. Why Use Portals?

The primary use case for portals is to deal with CSS stacking context issues. If a parent component has a style like \`overflow: hidden\` or a specific \`z-index\`, it can clip or hide a child component that needs to be displayed on top of the entire page (like a modal dialog).

By rendering the modal's DOM structure to a separate element, such as \`<div id="modal-root"></div>\` placed directly under \`<body>\`, it is no longer constrained by its parent's styles.

**Key benefits:**

*   **Avoid CSS issues:** Bypasses parent overflow and z-index problems.
*   **Semantic DOM:** Keeps your main app's DOM clean while placing pop-ups or modals in a more appropriate location at the top level.
*   **Accessibility:** Helps with managing keyboard focus for elements like modals, as they are separate in the DOM.

---

#### 2. How to Use Portals

Using a portal involves two steps:

1.  **Define a DOM container:** In your main \`public/index.html\` file, add a dedicated DOM node where the portal content will be rendered.
    \`\`\`html
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root"></div>
      <!-- Portal container -->
      <div id="modal-root"></div>
    </body>
    \`\`\`

2.  **Use \`ReactDOM.createPortal()\`:** In your component, import \`createPortal\` from \`react-dom\`. This function takes two arguments:
    *   \`child\`: The JSX you want to render.
    *   \`container\`: The DOM element to render into (the one you created in step 1).

**Syntax:**
\`\`\`jsx
import ReactDOM from 'react-dom';

ReactDOM.createPortal(child, container);
\`\`\`

**Example: A Simple Modal Component**
This \`Modal\` component renders its children into the \`#modal-root\` DOM node.
\`\`\`jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // For styling the modal overlay and content

// Get the portal container from the DOM
const modalRoot = document.getElementById('modal-root');

function Modal({ children }) {
  // Use createPortal to render the children into the modalRoot container
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export default Modal;
\`\`\`

**Using the Modal:**
Now, you can use the \`<Modal>\` component anywhere in your app. Even if it's nested deep inside other components, it will render at the top level of the DOM.
\`\`\`jsx
import React, { useState } from 'react';
import Modal from './Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      {isModalOpen && (
        <Modal>
          <h2>This is a Modal</h2>
          <p>It is rendered outside the main root div!</p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
\`\`\`
Even though the portal's content is in a different place in the DOM tree, it still exists as a normal child in the React component tree. This means it can still receive props and context, and events will bubble up to its parent components as expected.`,
    ['portals', 'modals', 'dom', 'react'],
    'intermediate'
  ),

  topic(
    'Lazy Loading and Code Splitting',
    `### Lazy Loading and Code Splitting

As a React application grows, its JavaScript bundle size can become very large. This can significantly slow down the initial load time. Code splitting is the technique of breaking up your application's large bundle into smaller chunks that can be loaded on demand. Lazy loading is the practice of loading these chunks only when they are actually needed.

This dramatically improves performance because the user only downloads the code necessary for the initial page, rather than the entire application.

---

#### 1. How It Works: \`React.lazy\` and \`Suspense\`

React provides two core features that make code splitting and lazy loading straightforward:

*   \`React.lazy()\`: A function that lets you render a dynamic import as a regular component. It takes a function that must call a dynamic \`import()\`. This returns a Promise that resolves to a module with a default export containing a React component.
*   \`<Suspense>\`: A component that lets you specify a "fallback" UI (like a loading spinner) to show while the lazy-loaded component's code is being fetched and loaded.

Together, they allow you to load components only when they are about to be rendered.

---

#### 2. Route-Based Code Splitting

The most common and effective way to implement code splitting is on a per-route basis. This means each page or major section of your application becomes its own JavaScript chunk, and it's only loaded when the user navigates to that route.

**Example:**
Imagine an application with a Home page and an About page. The code for the About page is not needed when the user first visits the homepage.

**Step 1: Convert static imports to dynamic imports with \`React.lazy\`**
\`\`\`jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Static import (loads immediately in the main bundle)
// import About from './pages/About';

// Dynamic import with React.lazy
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
\`\`\`
> **Note:** \`React.lazy\` currently only supports default exports.

**Step 2: Wrap your routes with the \`<Suspense>\` component**
The \`Suspense\` component must be placed somewhere above the lazy-loaded component in the tree. It will catch the "suspense" of any lazy component trying to render and will display the fallback UI until the code is ready.
\`\`\`jsx
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Suspense shows a loading message while the lazy component is fetched */}
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
\`\`\`

**Result:**

*   When a user first loads the application, only the code for the Home page is downloaded.
*   When they click the "About" link, React will fetch the JavaScript chunk for the About page.
*   While the About page chunk is loading, the user will see the "Loading page..." message. Once loaded, the About component will render.`,
    ['lazy-loading', 'code-splitting', 'performance', 'suspense', 'react'],
    'intermediate'
  ),
]);

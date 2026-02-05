import { category, topic } from '../../utils/topicHelpers';

export const asyncJavaScript = category('Asynchronous JavaScript', [
  topic(
    'The Event Loop',
    `### The Event Loop (Microtasks vs. Macrotasks)

The Event Loop is the core mechanism in JavaScript that allows it to handle asynchronous operations, like \`setTimeout\` or fetching data, without blocking the main thread. It's a constantly running process that manages the **Call Stack** and two important queues: the **Microtask Queue** and the **Macrotask Queue**.

---

#### Key Components

1.  **Call Stack:** Where all synchronous code is executed. It operates on a "first in, last out" basis. When a script is run, its global context is pushed to the stack.
2.  **Macrotask Queue (or Callback Queue):** A queue for lower-priority asynchronous tasks. The event loop picks **one** task from this queue per cycle.
    *   Examples: \`setTimeout\`, \`setInterval\`, I/O operations (like file reading), UI rendering.
3.  **Microtask Queue (or Job Queue):** A special, **higher-priority** queue. The event loop will run **all** tasks in this queue until it's empty before moving on.
    *   Examples: Promise handlers (\`.then()\`, \`.catch()\`, \`.finally()\`), \`queueMicrotask()\`.

---

#### The Order of Operations

The event loop follows a strict order, which determines when different pieces of code will run.

1.  **Run Synchronous Code:** First, all synchronous code in the current script is executed line by line on the Call Stack. Any async tasks encountered (\`setTimeout\`, \`Promise\`) are scheduled and their callbacks are sent to the appropriate queue.
2.  **Execute All Microtasks:** After the Call Stack is empty, the event loop immediately checks the **Microtask Queue**. It will execute *every single task* in this queue until it is completely empty. If a microtask adds a new microtask, that new task is also executed in this same phase.
3.  **Execute One Macrotask:** Only when the Microtask Queue is empty does the event loop check the **Macrotask Queue**. It takes just **one** task from this queue, pushes its callback onto the now-empty Call Stack, and executes it.
4.  **Repeat:** After the macrotask is complete, the loop goes back to **Step 2** (checking for microtasks again) and repeats the cycle.

**Analogy:** Think of microtasks as urgent, high-priority work you must finish immediately. Macrotasks are like regular, new tasks you can only start after all the urgent work is done.

---

#### Example Scenario

This is a classic interview question that demonstrates the concept:

\`\`\`javascript
console.log('1: Script Start'); // Sync

setTimeout(() => {
  console.log('2: setTimeout (Macrotask)'); // Sent to Macrotask Queue
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise 1 (Microtask)'); // Sent to Microtask Queue
  Promise.resolve().then(() => {
    console.log('4: Promise 2 (Microtask)'); // Also sent to Microtask Queue
  });
});

console.log('5: Script End'); // Sync
\`\`\`

#### Predicted Output:

1.  **\`1: Script Start\`** (Synchronous)
2.  **\`5: Script End\`** (Synchronous)
    *   The synchronous code finishes. Now the event loop checks the queues.
3.  **\`3: Promise 1 (Microtask)\`**
    *   The Microtask Queue is checked first and is not empty. This promise callback runs.
4.  **\`4: Promise 2 (Microtask)\`**
    *   While executing the first microtask, another microtask was added. The event loop must clear the *entire* microtask queue before moving on, so this one runs next.
5.  **\`2: setTimeout (Macrotask)\`**
    *   The Microtask Queue is finally empty. The event loop now picks one task from the Macrotask Queue and executes it.

#### Final Log Order:
\`\`\`
1: Script Start
5: Script End
3: Promise 1 (Microtask)
4. Promise 2 (Microtask)
2: setTimeout (Macrotask)
\`\`\``,
    ['event-loop', 'async', 'microtasks', 'macrotasks', 'promises'],
    'advanced'
  ),

  topic(
    'Promises',
    `### Promises: \`.then()\`, \`.catch()\`, \`.finally()\`, and \`Promise.all()\`

A \`Promise\` is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It provides a cleaner, more robust way to handle asynchronous code than traditional callbacks.

---

#### The Three States of a Promise

A Promise is always in one of three states:

1.  **Pending:** The initial state; the asynchronous operation has not yet completed.
2.  **Fulfilled (or Resolved):** The operation completed successfully, and the promise has a resulting value.
3.  **Rejected:** The operation failed, and the promise has a reason for the failure (an error).

A promise is **settled** when it is either fulfilled or rejected. It can only be settled once.

---

#### \`.then(onFulfilled, onRejected)\`

The \`.then()\` method is the primary way to interact with a promise. It takes up to two arguments: a callback function for the fulfilled state and another for the rejected state.

It returns a **new promise**, which is what allows for chaining.

\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
  // Simulate an async operation
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("Operation was successful!");
    } else {
      reject("Operation failed.");
    }
  }, 1000);
});

myPromise.then(
  (successMessage) => { // onFulfilled callback
    console.log("Success:", successMessage);
  },
  (errorMessage) => { // onRejected callback (less common)
    console.log("Error:", errorMessage);
  }
);
\`\`\`

---

#### \`.catch(onRejected)\`

The \`.catch()\` method is syntactic sugar for \`.then(null, onRejected)\`. It's a cleaner, more readable way to handle only the rejection case. It also returns a new promise, allowing you to continue chaining.

Using \`.catch()\` is the standard and preferred way to handle errors in a promise chain.

\`\`\`javascript
myPromise
  .then((successMessage) => {
    console.log(successMessage);
    // You can return a value here to be passed to the next .then()
    return successMessage.toUpperCase();
  })
  .then((uppercasedMessage) => {
    console.log("Uppercased:", uppercasedMessage);
  })
  .catch((errorMessage) => {
    // This will catch a rejection from myPromise or any preceding .then()
    console.error("Caught an error:", errorMessage);
  });
\`\`\`

---

#### \`.finally(onFinally)\`

The \`.finally()\` method schedules a function to be called when the promise is settled (either fulfilled or rejected). It is useful for cleanup operations that should happen regardless of the outcome, such as hiding a loading spinner.

The \`.finally()\` callback receives no arguments and does not affect the promise's final value.

\`\`\`javascript
showLoadingSpinner(); // Show spinner before the operation starts

myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => {
    // This code runs no matter what happens
    hideLoadingSpinner();
    console.log("Promise settled. Cleanup is done.");
  });
\`\`\`

---

#### \`Promise.all(iterable)\`

\`Promise.all()\` is a static method that takes an iterable (like an array) of promises and returns a single new promise.

*   This new promise **fulfills** when **all** of the input promises have fulfilled. The fulfillment value is an array of the results from the input promises, in the same order.
*   It **rejects** as soon as **any one** of the input promises rejects. The rejection reason is the reason from the first promise that rejected.

This is extremely useful for running multiple asynchronous operations in parallel and waiting for all of them to complete.

\`\`\`javascript
const promise1 = Promise.resolve("First");
const promise2 = new Promise(resolve => setTimeout(() => resolve("Second"), 500));
const promise3 = fetch('https://api.example.com/data'); // Another promise

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    // results is an array: ["First", "Second", <Response Object>]
    console.log("All promises fulfilled:", results);
  })
  .catch((error) => {
    console.error("One of the promises rejected:", error);
  });
\`\`\``,
    ['promises', 'async', 'then', 'catch', 'finally', 'promise-all'],
    'intermediate'
  ),

  topic(
    'async/await',
    `### \`async/await\`

\`async/await\` is modern JavaScript syntax built on top of Promises that allows you to write asynchronous code as if it were synchronous. It makes complex asynchronous operations, like sequential API calls, much easier to read and manage.

---

#### The \`async\` Keyword

When you place the \`async\` keyword before a function declaration, it does two things:

1.  It ensures the function **always returns a promise**.
2.  It allows the use of the \`await\` keyword inside that function.

If the function explicitly returns a value, that value will be the resolved value of the promise. If the function throws an error, the promise will be rejected with that error.

\`\`\`javascript
// This function implicitly returns a promise that resolves with "Hello"
async function greet() {
  return "Hello";
}

greet().then(value => console.log(value)); // Logs: "Hello"

// This function will return a rejected promise
async function fail() {
  throw new Error("Something went wrong");
}

fail().catch(error => console.error(error.message)); // Logs: "Something went wrong"
\`\`\`

---

#### The \`await\` Keyword

The \`await\` keyword can **only be used inside an \`async\` function**. It tells the function to pause its execution at that line and wait for a promise to be settled.

*   If the promise **fulfills**, \`await\` unwraps the promise and returns its resolved value.
*   If the promise **rejects**, \`await\` throws the rejection reason as an error.

This is what makes the code look synchronous.

**Example: Before (\`.then()\` chain) vs. After (\`async/await\`)**

Let's imagine fetching a user and then fetching their posts.

**Using \`.then()\`:**
\`\`\`javascript
function fetchUserPostsWithThen() {
  fetch('https://api.example.com/users/1')
    .then(response => response.json())
    .then(user => {
      return fetch(\`https://api.example.com/posts?userId=\${user.id}\`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log(posts);
    })
    .catch(error => {
      console.error("Failed to fetch posts:", error);
    });
}
\`\`\`

**Using \`async/await\`:**
The code is much more linear and readable.

\`\`\`javascript
async function fetchUserPostsWithAwait() {
  try {
    const userResponse = await fetch('https://api.example.com/users/1');
    const user = await userResponse.json();

    const postsResponse = await fetch(\`https://api.example.com/posts?userId=\${user.id}\`);
    const posts = await postsResponse.json();

    console.log(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}
\`\`\`

---

#### Error Handling with \`try...catch\`

One of the major benefits of \`async/await\` is that you can use standard \`try...catch\` blocks for error handling. This is often more intuitive and powerful than the \`.catch()\` method, as it allows you to handle errors from multiple \`await\` expressions in a single block.

As shown in the example above, the \`try\` block contains all the "happy path" logic, and the \`catch\` block will handle any rejection from any of the \`await\` calls within it.

---

### Summary

| Aspect | \`.then()\` Chaining | \`async/await\` |
| :--- | :--- | :--- |
| **Readability** | Can become nested and hard to follow ("callback hell"). | Linear, sequential, and looks like synchronous code. |
| **Error Handling** | Uses \`.catch()\` for each chain or at the end. | Uses standard \`try...catch\` blocks. |
| **Debugging** | Can be difficult to step through asynchronous chains. | Easier to debug as you can step over \`await\` calls like regular lines of code. |

**Best Practice:** Use \`async/await\` for most of your asynchronous logic as it leads to cleaner, more maintainable code.`,
    ['async', 'await', 'promises', 'error-handling'],
    'intermediate'
  ),
]);

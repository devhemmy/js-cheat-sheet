import { category, topic } from '../../utils/topicHelpers';

export const scopeAndFunctions = category('Scope and Functions', [
  topic(
    'Scope: Global, Function, and Block',
    `### Scope: Global, Function, and Block

Scope in JavaScript determines the accessibility or visibility of variables. It is the context in which variables are declared and can be accessed. There are three main types of scope.

---

#### 1. Global Scope

Any variable declared outside of a function or block belongs to the global scope. These variables are accessible from anywhere in your entire JavaScript program.

Declaring variables in the global scope is generally discouraged as it can lead to naming conflicts and make code harder to manage.

\`\`\`javascript
// This variable is in the global scope
const globalVar = "I am accessible everywhere";

function someFunction() {
  console.log(globalVar); // Accessible inside the function
}

someFunction();
console.log(globalVar); // Accessible outside the function as well
\`\`\`

---

#### 2. Function Scope

Variables declared with \`var\` are **function-scoped**. This means they are accessible anywhere within the function they are declared in, regardless of the block (e.g., \`if\` statement or \`for\` loop) they are in.

\`\`\`javascript
function myFunction() {
  var functionScopedVar = "I am visible throughout the function";

  if (true) {
    console.log(functionScopedVar); // Accessible here
  }
}

myFunction();
// console.log(functionScopedVar); // Throws ReferenceError: not defined (cannot be accessed outside the function)
\`\`\`

**Hoisting within Function Scope:**
\`var\` declarations are "hoisted" (lifted) to the top of their function scope, which is why you can access them before the line of declaration (though their value will be \`undefined\`).

---

#### 3. Block Scope

Introduced in ES6 with \`let\` and \`const\`, block scope limits a variable's accessibility to the specific block (\`{ }\`) in which it was declared. This is more predictable and helps prevent bugs caused by variables "leaking" out of their intended blocks.

Most modern programming languages use block scope, and it is the preferred way to declare variables in JavaScript.

\`\`\`javascript
function myBlockScopeFunction() {
  if (true) {
    let letVar = "I am a block-scoped let";
    const constVar = "I am a block-scoped const";
    var varVar = "I am function-scoped!"; // 'var' is NOT block-scoped

    console.log(letVar);   // Accessible here
    console.log(constVar); // Accessible here
    console.log(varVar);   // Accessible here
  }

  // console.log(letVar);   // Throws ReferenceError: not defined
  // console.log(constVar); // Throws ReferenceError: not defined
  console.log(varVar);   // "I am function-scoped!" -> var leaks out of the if-block
}

myBlockScopeFunction();
\`\`\`

---

### Summary and Best Practice

| Keyword | Scope | Hoisted? | Notes |
| :--- | :--- | :--- | :--- |
| **\`var\`** | **Function** | Yes (with \`undefined\`) | Avoid in modern JS. Leaks out of blocks. |
| **\`let\`** | **Block** | Yes (but not initialized) | The preferred choice for variables that need to be reassigned. |
| **\`const\`**| **Block** | Yes (but not initialized) | The preferred choice for all variables unless they need reassignment. |

By defaulting to \`const\` and using \`let\` only when necessary, you leverage the predictability and safety of block scope, making your code easier to read and maintain.`,
    ['scope', 'global', 'function', 'block', 'variables'],
    'beginner'
  ),

  topic(
    'Closures',
    `### Closures

A closure is a fundamental concept in JavaScript where a function **remembers the variables from the scope in which it was created**, even if that function is executed in a different scope.

In simple terms, a function and its connection to its outer scope's variables form a closure. This "connection" or "backpack" of variables persists even after the outer function has finished running.

---

#### How It Works: A Simple Example

\`\`\`javascript
function createGreeter(greeting) {
  const name = "Ibrahem"; // Variable in the outer scope

  // This inner function is a closure.
  // It "closes over" the \`greeting\` and \`name\` variables.
  function greet() {
    console.log(\`\${greeting}, \${name}!\`);
  }

  return greet; // We return the inner function itself
}

// 1. We call the outer function. It runs and finishes.
const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

// 2. We are now calling the inner function, long after its parent has completed.
//    Yet, it still remembers the variables from when it was created.
sayHello(); // Logs: "Hello, Ibrahem!"
sayHi();    // Logs: "Hi, Ibrahem!"
\`\`\`

In this example, the \`greet\` function maintains a reference to its lexical environment, which includes the \`greeting\` and \`name\` variables. Even when \`createGreeter\` is done, \`greet\` (now assigned to \`sayHello\` and \`sayHi\`) carries its "backpack" of variables with it.

---

#### Practical Use Cases for Closures

Closures are not just a theoretical concept; they are used constantly in JavaScript programming.

**1. Data Privacy and Encapsulation (The Module Pattern)**

Closures are the primary way to create private variables in JavaScript. You can expose a public interface (a set of functions) that can interact with the private internal state, but the state itself cannot be accessed directly from the outside.

\`\`\`javascript
function createCounter() {
  let count = 0; // This variable is private to the closure

  // We return an object with methods that can access 'count'
  return {
    increment: function() {
      count++;
      console.log(count);
    },
    decrement: function() {
      count--;
      console.log(count);
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2

// You CANNOT access \`count\` directly from the outside.
// console.log(counter.count); // undefined
// This protects the internal state from accidental modification.

console.log(\`The current count is: \${counter.getCount()}\`); // The current count is: 2
\`\`\`

**2. Event Handlers and Callbacks**

Closures are essential for callbacks, especially in loops, to capture the correct value at each iteration.

**The Classic Loop Problem:**
Without a closure, a \`setTimeout\` inside a \`for\` loop with \`var\` will produce an unexpected result. All the callbacks will reference the *final* value of \`i\`.

\`\`\`javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    // By the time this runs, the loop is finished and \`i\` is 4.
    console.log(i); // Logs 4, 4, 4
  }, 100);
}
\`\`\`
**The Modern Solution (\`let\`):**
Using \`let\` instead of \`var\` solves this problem automatically. \`let\` is block-scoped, so it creates a new binding of \`i\` for each loop iteration, effectively creating a closure for each \`setTimeout\` callback.

\`\`\`javascript
for (let i = 1; i <= 3; i++) {
  setTimeout(function() {
    // \`let\` creates a new \`i\` for each iteration.
    // The callback closes over this new \`i\`.
    console.log(i); // Logs 1, then 2, then 3
  }, 100);
}
\`\`\``,
    ['closures', 'scope', 'functions', 'encapsulation'],
    'intermediate'
  ),

  topic(
    'Arrow Functions vs. Regular Functions',
    `### Arrow Functions vs. Regular Functions

While the behavior of the \`this\` keyword is the most significant difference, arrow functions and regular functions have several other distinctions in syntax and functionality.

---

#### Key Differences Summary

| Feature | Regular Function | Arrow Function |
| :--- | :--- | :--- |
| **\`this\` Binding** | Dynamic (depends on call site) | Lexical (inherits from parent) |
| **Syntax** | Verbose (\`function\` keyword, \`{}\`) | Concise (\`=>\`) |
| **\`arguments\` Object**| Has its own \`arguments\` object | Does **not** have its own \`arguments\` |
| **Constructor** | Can be used with \`new\` | **Cannot** be used with \`new\` |
| **Implicit Return** | Requires \`return\` keyword | Can implicitly return if no block \`{}\` |

---

#### 1. Syntax

Arrow functions offer a much more compact syntax.

\`\`\`javascript
// Regular Function Expression
const addRegular = function(a, b) {
  return a + b;
};

// Arrow Function
const addArrow = (a, b) => a + b; // Implicit return (no curly braces)

// Arrow function with a block (requires explicit return)
const addArrowWithBlock = (a, b) => {
  console.log(\`Adding \${a} and \${b}\`);
  return a + b;
};
\`\`\`

---

#### 2. The \`arguments\` Object

Regular functions have a special, array-like object named \`arguments\` that contains all the arguments passed to the function. Arrow functions do **not** have their own \`arguments\` object.

To capture all arguments in an arrow function, you should use **rest parameters (\`...\`)**.

\`\`\`javascript
// Regular Function
function logArgsRegular() {
  console.log(arguments); // [1, 2, 3, "hello"] (an array-like arguments object)
}
logArgsRegular(1, 2, 3, "hello");


// Arrow Function
const logArgsArrow = (...args) => {
  // console.log(arguments); // Throws ReferenceError: arguments is not defined
  console.log(args);        // [1, 2, 3, "hello"] (a true array)
};
logArgsArrow(1, 2, 3, "hello");
\`\`\`
Using rest parameters (\`...args\`) is the modern and preferred approach for both types of functions as it provides a true array, not just an array-like object.

---

#### 3. Usage as Constructors

Regular functions can be used as constructors to create objects with the \`new\` keyword. Arrow functions **cannot** be used as constructors and will throw a \`TypeError\` if you try.

\`\`\`javascript
// Regular Function as a constructor
function Person(name) {
  this.name = name;
}
const ibrahem = new Person('Ibrahem');
console.log(ibrahem.name); // 'Ibrahem'

// Arrow Function as a constructor
const Animal = (name) => {
  this.name = name;
};
// const dog = new Animal('Dog'); // Throws TypeError: Animal is not a constructor
\`\`\`

---

### When to Use Each

*   **Use an Arrow Function (\`=>\`) for:**
    *   Most callbacks (\`.map()\`, \`.filter()\`, \`setTimeout()\`, etc.) where you want to preserve the \`this\` from the parent scope.
    *   Short, non-method functions.

*   **Use a Regular Function (\`function\`) for:**
    *   **Object methods** when you need \`this\` to refer to the object itself.
    *   **Constructors** for creating new instances with \`new\`.
    *   Situations where you need the legacy \`arguments\` object (though rest parameters are better).`,
    ['arrow-functions', 'functions', 'this', 'es6'],
    'intermediate'
  ),
]);

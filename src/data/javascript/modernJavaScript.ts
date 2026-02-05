import { category, topic } from '../../utils/topicHelpers';

export const modernJavaScript = category('Modern JavaScript (ES6+)', [
  topic(
    'Destructuring',
    `### Destructuring

Destructuring is an ES6 feature that provides a convenient way to extract data from arrays or objects and assign them to distinct variables. It makes your code cleaner and more readable by reducing the need for repetitive dot notation or bracket notation.

---

#### 1. Object Destructuring

Object destructuring allows you to unpack properties from an object into variables with the same name.

**Basic Usage:**
\`\`\`javascript
const person = {
  firstName: 'Ibrahem',
  lastName: 'Bastawi',
  age: 30
};

// Instead of:
// const firstName = person.firstName;
// const age = person.age;

// You can do this:
const { firstName, age } = person;

console.log(firstName); // "Ibrahem"
console.log(age);       // 30
\`\`\`

**Renaming Variables:**
You can assign the property to a variable with a different name using a colon (\`:\`).
\`\`\`javascript
const { firstName: fName, lastName: lName } = person;

console.log(fName); // "Ibrahem"
// console.log(firstName); // Throws ReferenceError
\`\`\`

**Default Values:**
You can provide a default value for a property that may not exist on the object.
\`\`\`javascript
const { city = 'Cairo' } = person;

console.log(city); // "Cairo"
\`\`\`

**Nested Destructuring:**
You can also destructure nested objects.
\`\`\`javascript
const user = {
  id: 1,
  details: {
    name: 'John',
    location: 'US'
  }
};

const { details: { name, location } } = user;
console.log(name);     // "John"
console.log(location); // "US"
\`\`\`

---

#### 2. Array Destructuring

Array destructuring allows you to unpack values from an array into variables based on their **position**.

**Basic Usage:**
\`\`\`javascript
const colors = ['Red', 'Green', 'Blue'];

// Instead of:
// const firstColor = colors[0];
// const secondColor = colors[1];

// You can do this:
const [firstColor, secondColor] = colors;

console.log(firstColor);  // "Red"
console.log(secondColor); // "Green"
\`\`\`

**Skipping Elements:**
You can use a comma to skip an element you don't need.
\`\`\`javascript
const [ , , thirdColor] = colors;
console.log(thirdColor); // "Blue"
\`\`\`

**Rest Pattern:**
You can use the rest operator (\`...\`) to collect the remaining elements of an array into a new array. The rest operator must be the last element in the destructuring assignment.
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...restOfTheNumbers] = numbers;

console.log(first);             // 1
console.log(second);            // 2
console.log(restOfTheNumbers);  // [3, 4, 5]
\`\`\`

**Default Values:**
Similar to object destructuring, you can provide default values for array elements.
\`\`\`javascript
const settings = ['Dark'];
const [theme = 'Light', fontSize = 16] = settings;

console.log(theme);    // "Dark" (from the array)
console.log(fontSize); // 16 (default value is used)
\`\`\`

---

#### Practical Use Cases

**Function Parameters:**
Destructuring is extremely useful for handling function parameters, especially when dealing with an options object.
\`\`\`javascript
// Instead of: function drawChart(options) { const color = options.color; ... }

function drawChart({ color = 'blue', width = 600, height = 400 }) {
  console.log(\`Drawing a chart with color \${color} and size \${width}x\${height}\`);
}

drawChart({ color: 'red', height: 300 }); // "Drawing a chart with color red and size 600x300"
\`\`\`

**Swapping Variables:**
Destructuring provides a clean, one-line way to swap the values of two variables.
\`\`\`javascript
let a = 1;
let b = 2;

[a, b] = [b, a]; // The magic happens here

console.log(a); // 2
console.log(b); // 1
\`\`\``,
    ['destructuring', 'es6', 'arrays', 'objects'],
    'beginner'
  ),

  topic(
    'Spread and Rest Operators',
    `### Spread (\`...\`) and Rest (\`...\`) Operators

The \`...\` syntax in JavaScript is used for two distinct but related concepts: the **Spread Operator** and the **Rest Parameter**. The meaning of \`...\` changes depending on where it is used.

*   **Spread (\`...\`)**: *Expands* an iterable (like an array or string) or an object's properties. It's used where multiple elements or properties are expected.
*   **Rest (\`...\`)**: *Collects* multiple elements or properties into a single array or object. It's used in function parameters and destructuring assignments.

---

#### 1. The Spread Operator

The spread operator unpacks elements. Think of it as taking a container and spreading its contents out.

**Use with Arrays:**
\`\`\`javascript
// 1. Combining Arrays
const fruits = ['apple', 'banana'];
const vegetables = ['carrot', 'potato'];
const food = [...fruits, ...vegetables];
console.log(food); // ['apple', 'banana', 'carrot', 'potato']

// 2. Copying an Array (shallow copy)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (original is not affected)
console.log(copy);     // [1, 2, 3, 4]

// 3. Passing Array Elements as Function Arguments
const numbers = [10, 5, 25];
const maxNumber = Math.max(...numbers); // Equivalent to Math.max(10, 5, 25)
console.log(maxNumber); // 25
\`\`\`

**Use with Objects:**
\`\`\`javascript
// 1. Combining Objects
const user = { name: 'Ibrahem', age: 30 };
const job = { title: 'Engineer', company: 'Google' };
const employee = { ...user, ...job, location: 'Cairo' };
console.log(employee); // { name: 'Ibrahem', age: 30, title: 'Engineer', company: 'Google', location: 'Cairo' }
// Note: If properties overlap, the last object's property wins.

// 2. Copying an Object (shallow copy)
const originalObj = { a: 1, b: 2 };
const copyObj = { ...originalObj };
console.log(copyObj); // { a: 1, b: 2 }
\`\`\`

---

#### 2. The Rest Parameter / Rest Property

The rest syntax collects elements into a single container. Think of it as gathering up a list of items into an array. **It must always be the last element** in a function parameter list or a destructuring assignment.

**Use in Function Parameters:**
It allows a function to accept an indefinite number of arguments as an array.
\`\`\`javascript
function sum(...numbers) {
  // \`numbers\` is a true array containing all arguments passed to the function
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2));             // 3
console.log(sum(1, 2, 3, 4, 5));    // 15
console.log(sum());                 // 0
\`\`\`

**Use in Destructuring:**
It gathers the remaining elements into a new array or object.
\`\`\`javascript
// 1. Array Destructuring
const scores = [95, 88, 76, 65, 50];
const [winner, runnerUp, ...others] = scores;

console.log(winner);   // 95
console.log(runnerUp); // 88
console.log(others);   // [76, 65, 50]

// 2. Object Destructuring
const person = {
  name: 'John',
  age: 40,
  city: 'New York',
  country: 'USA'
};

const { name, age, ...address } = person;

console.log(name);    // 'John'
console.log(age);     // 40
console.log(address); // { city: 'New York', country: 'USA' }
\`\`\`

---

### Summary

| Operator | Action | Used In | Example |
| :--- | :--- | :--- | :--- |
| **Spread** | **Expands** | Function calls, array literals, object literals | \`const arr = [1, ...otherArr];\` |
| **Rest** | **Collects** | Function parameters, destructuring assignments| \`function sum(...args) {}\` |`,
    ['spread', 'rest', 'es6', 'arrays', 'objects'],
    'beginner'
  ),

  topic(
    'Modules: import and export',
    `### Modules: \`import\` and \`export\`

JavaScript Modules (ES Modules or ESM) are the standard, built-in way to organize and share code across multiple files. A module is simply a file. By using modules, you can keep your code structured, prevent global scope pollution, and reuse code efficiently.

The two core keywords for modules are \`export\` and \`import\`.

*   **\`export\`**: Makes variables, functions, or classes from one module available to other modules.
*   **\`import\`**: Pulls in exported code from another module to be used in the current module.

---

#### \`export\`: Making Code Available

There are two main types of exports: **Named Exports** and **Default Exports**.

**1. Named Exports**

You can have **multiple** named exports per module. This is useful for exporting a collection of utility functions or values. The name of the imported variable must be the same as the name of the exported variable.

\`\`\`javascript
// 📁 utils.js

export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export class Calculator {
  // ... class implementation
}
\`\`\`

**2. Default Export**

You can only have **one** default export per module. This is typically used for the "main" thing the module provides, like a primary class or function (e.g., a React component).

\`\`\`javascript
// 📁 Greeter.js

export default function greet(name) {
  return \`Hello, \${name}!\`;
}

// Or for a class:
// export default class Greeter { ... }
\`\`\`

---

#### \`import\`: Using Exported Code

**1. Importing Named Exports**

You must use curly braces \`{ }\` to import named exports, and the names inside the braces must match the exported names.

\`\`\`javascript
// 📁 main.js
import { PI, add } from './utils.js';

console.log(PI); // 3.14159
console.log(add(5, 10)); // 15
\`\`\`

*   **Renaming with \`as\`**: If there's a naming conflict, you can rename an import.
    \`\`\`javascript
    import { add as sum } from './utils.js';
    console.log(sum(2, 3)); // 5
    \`\`\`

*   **Importing Everything**: You can import all named exports into a single object.
    \`\`\`javascript
    import * as utils from './utils.js';
    console.log(utils.PI);
    console.log(utils.add(2, 3));
    \`\`\`

**2. Importing a Default Export**

You import a default export without curly braces, and you can give it any name you want.

\`\`\`javascript
// 📁 main.js
import myGreetingFunction from './Greeter.js'; // You can name it anything

console.log(myGreetingFunction('Ibrahem')); // "Hello, Ibrahem!"
\`\`\`

**3. Importing Both Default and Named Exports**

You can combine both types of imports in a single statement. The default import must come first.

\`\`\`javascript
// 📁 module.js
export default function mainFunc() { /* ... */ }
export const helper = () => { /* ... */ };

// 📁 app.js
import mainFunc, { helper } from './module.js';
\`\`\`

---

#### How to Use Modules in the Browser

To use ES Modules in a browser, you must add \`type="module"\` to your \`<script>\` tag in your HTML file. This tells the browser to treat the file as a module, allowing it to use \`import\` and \`export\`.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <!-- This script is a module -->
    <script type="module" src="main.js"></script>
  </body>
</html>
\`\`\``,
    ['modules', 'import', 'export', 'es6'],
    'intermediate'
  ),

  topic(
    'Array Methods: map, filter, reduce, find, forEach',
    `### Array Methods: \`map\`, \`filter\`, \`reduce\`, \`find\`, \`forEach\`

These are essential higher-order functions in JavaScript for working with arrays. They allow you to write more declarative and readable code by abstracting away the manual looping process.

---

#### \`forEach(callback)\`

*   **What it does:** Executes a provided function once for each array element. It's a modern replacement for a \`for\` loop.
*   **Return value:** \`undefined\`.
*   **Use case:** When you need to iterate over an array to perform an action (a "side effect") for each element, like logging to the console or updating a DOM element. **It does not create a new array.**

\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];

fruits.forEach((fruit, index) => {
  console.log(\`Fruit at index \${index} is \${fruit}\`);
});
// Logs:
// "Fruit at index 0 is apple"
// "Fruit at index 1 is banana"
// "Fruit at index 2 is cherry"
\`\`\`

---

#### \`map(callback)\`

*   **What it does:** Creates a **new array** by calling a provided function on every element in the original array and storing the results.
*   **Return value:** A **new array** of the same length as the original.
*   **Use case:** When you want to **transform** each element of an array into something new.

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]

const users = [{ name: 'Ibrahem' }, { name: 'John' }];
const names = users.map(user => user.name);
console.log(names); // ['Ibrahem', 'John']
\`\`\`

---

#### \`filter(callback)\`

*   **What it does:** Creates a **new array** containing all elements from the original array that pass a test (i.e., the callback function returns \`true\`).
*   **Return value:** A **new array** that is a subset of the original array. Its length can be less than or equal to the original.
*   **Use case:** When you want to **select** a subset of elements from an array based on a condition.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 75 }
];
const affordableProducts = products.filter(product => product.price < 100);
console.log(affordableProducts); // [{ name: 'Mouse', price: 25 }, { name: 'Keyboard', price: 75 }]
\`\`\`

---

#### \`reduce(callback, initialValue)\`

*   **What it does:** Executes a "reducer" function on each element of the array, resulting in a single accumulated output value. It is the most versatile of these methods.
*   **Return value:** The single, accumulated value.
*   **Callback arguments:** The callback function takes two main arguments: \`(accumulator, currentValue)\`. The \`accumulator\` is the value returned from the previous iteration, and \`currentValue\` is the current element being processed.
*   **Use case:** Summing an array, counting occurrences, flattening an array of arrays, grouping objects by a property.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
// The \`0\` is the initialValue for the accumulator (total)
const sum = numbers.reduce((total, currentNumber) => total + currentNumber, 0);
console.log(sum); // 15
\`\`\`

---

#### \`find(callback)\`

*   **What it does:** Returns the **first element** in the array that satisfies the provided testing function. It stops searching as soon as it finds a match.
*   **Return value:** The first matching **element**, or \`undefined\` if no element is found.
*   **Use case:** When you need to find a single, specific item in an array.

\`\`\`javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Ibrahem' },
  { id: 3, name: 'Jane' }
];

const userIbrahem = users.find(user => user.name === 'Ibrahem');
console.log(userIbrahem); // { id: 2, name: 'Ibrahem' }

const userNotFound = users.find(user => user.id === 4);
console.log(userNotFound); // undefined
\`\`\``,
    ['array-methods', 'map', 'filter', 'reduce', 'find', 'forEach'],
    'beginner'
  ),
]);

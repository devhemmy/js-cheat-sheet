import { category, topic } from '../../utils/topicHelpers';

export const coreFundamentals = category('Core Fundamentals', [
  topic(
    'var vs. let vs. const',
    `### var vs. let vs. const

These are three keywords used to declare variables in JavaScript. Their main differences are **scope**, **re-assignment**, and **hoisting**. Modern JavaScript favors \`let\` and \`const\`.

| Feature | \`var\` | \`let\` | \`const\` |
| :--- | :--- | :--- | :--- |
| **Scope** | Function-scoped | Block-scoped \`{}\` | Block-scoped \`{}\` |
| **Re-assignable**| Yes | Yes | **No** |
| **Re-declarable**| Yes | **No** | **No** |
| **Hoisting** | Hoisted and initialized with \`undefined\` | Hoisted but not initialized | Hoisted but not initialized |

---

#### 1. Scope: The Biggest Difference

*   **\`var\`** is **function-scoped**. It is only contained within a function, even if declared inside a smaller block like a \`for\` loop or \`if\` statement. This can lead to unexpected behavior.
*   **\`let\`** and **\`const\`** are **block-scoped**. They are only accessible within the block (the \`{ }\`) they are defined in, which is more predictable and less error-prone.

**Example:**
\`\`\`javascript
function scopeTest() {
  if (true) {
    var varVariable = "I am var";      // Leaks out to the whole function
    let letVariable = "I am let";      // Stays inside this if-block
    const constVariable = "I am const";// Stays inside this if-block
  }
  console.log(varVariable);     // "I am var"
  // console.log(letVariable);  // Throws ReferenceError: not defined
  // console.log(constVariable);// Throws ReferenceError: not defined
}
\`\`\`

---

#### 2. Re-assignment and Re-declaration

*   **\`var\`**: You can re-declare and update \`var\` variables.
*   **\`let\`**: You can update the value, but you **cannot** re-declare it in the same scope.
*   **\`const\`**: You **cannot** re-declare or re-assign it. It must be given a value when declared.
    *   **Note:** For \`const\` objects and arrays, you can still change their internal content (properties or elements), but you cannot re-assign the variable to a new object or array.

---

#### 3. Hoisting

Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

*   **\`var\`**: Declarations are hoisted and initialized with a value of \`undefined\`. You can access it before the declaration line without an error (you'll just get \`undefined\`).
*   **\`let\`** and **\`const\`**: Declarations are hoisted but **not initialized**. Accessing them before the declaration line results in a \`ReferenceError\`. This area before the declaration is called the "Temporal Dead Zone" (TDZ).

**Example:**
\`\`\`javascript
console.log(myVar); // undefined
var myVar = 5;

// console.log(myLet); // Throws ReferenceError: Cannot access 'myLet' before initialization
let myLet = 10;
\`\`\`

---

### Best Practice

*   Use **\`const\`** by default.
*   Use **\`let\`** only when you know you need to re-assign the variable's value.
*   Avoid using **\`var\`** in modern JavaScript.`,
    ['variables', 'scope', 'hoisting', 'es6'],
    'beginner'
  ),

  topic(
    'The this Keyword',
    `### The \`this\` Keyword

The \`this\` keyword is a reference to the **execution context** of a function. Its value is not static; it is determined by *how the function is called*.

---

#### \`this\` in a Regular Function (Dynamic Context)

The value of \`this\` is determined at the moment the function is invoked. There are four main rules:

1.  **As a Method of an Object:** When a function is called as a method on an object, \`this\` refers to the **object** the method was called on.
    \`\`\`javascript
    const person = {
      name: 'Ibrahem',
      greet: function() {
        console.log(\`Hello, my name is \${this.name}\`);
      }
    };

    person.greet(); // \`this\` is the \`person\` object. Logs: "Hello, my name is Ibrahem"
    \`\`\`

2.  **As a Standalone Function:** When a function is called by itself (not as an object method), \`this\` defaults to the **global object** (\`window\` in browsers, \`global\` in Node.js). In strict mode, it is \`undefined\`.
    \`\`\`javascript
    function showThis() {
      console.log(this);
    }

    showThis(); // \`this\` is the \`window\` object (in a browser)
    \`\`\`

3.  **As a Constructor:** When a function is used as a constructor with the \`new\` keyword, \`this\` refers to the **new instance** being created.
    \`\`\`javascript
    function Car(brand) {
      this.brand = brand;
    }

    const myCar = new Car('Ford');
    console.log(myCar.brand); // \`this\` inside Car referred to \`myCar\`. Logs: "Ford"
    \`\`\`

4.  **Explicitly Set:** You can manually set the value of \`this\` using \`.call()\`, \`.apply()\`, or \`.bind()\`.

---

#### \`this\` in an Arrow Function (Lexical Context)

Arrow functions do not have their own \`this\` context. Instead, they **inherit \`this\` from their parent scope** at the time they are defined. The value of \`this\` inside an arrow function is determined by its surrounding code and remains fixed.

This behavior is especially useful for callbacks inside methods.

**Example: Regular vs. Arrow Function Callback**
\`\`\`javascript
const user = {
  name: 'John',
  scores: [90, 85, 95],

  // Using a regular function for the callback
  calculateAverage_Regular: function() {
    setTimeout(function() {
      // \`this\` here is the \`window\` object, because setTimeout is a window method.
      // \`this.name\` is undefined, causing a bug.
      console.log(\`Average for \${this.name} is... WRONG!\`); // "Average for undefined is... WRONG!"
    }, 500);
  },

  // Using an arrow function for the callback
  calculateAverage_Arrow: function() {
    setTimeout(() => {
      // The arrow function inherits \`this\` from its parent, \`calculateAverage_Arrow\`.
      // In that context, \`this\` is the \`user\` object.
      const avg = this.scores.reduce((a, b) => a + b) / this.scores.length;
      console.log(\`Average for \${this.name} is \${avg}\`); // "Average for John is 90"
    }, 1000);
  }
};

user.calculateAverage_Regular();
user.calculateAverage_Arrow();
\`\`\`

---

### Summary

| Function Type | How \`this\` is Determined |
| :--- | :--- |
| **Regular Function** | **Dynamically** - Depends on *how it's called*. |
| **Arrow Function** | **Lexically** - Inherits from the *parent scope where it was defined*. |`,
    ['this', 'context', 'functions', 'arrow-functions'],
    'intermediate'
  ),

  topic(
    'Data Types: Primitives vs. Objects',
    `### Data Types: Primitives vs. Objects

In JavaScript, all data types are divided into two main categories: **Primitive Types** and **Object (or Reference) Types**. The fundamental difference between them is how they are stored in memory and how they are passed around in your code.

---

#### Primitive Types

Primitives are the most basic data types. They are **immutable**, meaning their value cannot be changed once created. Any operation that seems to modify a primitive actually creates a new one.

There are 7 primitive types:
*   \`string\`
*   \`number\`
*   \`boolean\`
*   \`null\`
*   \`undefined\`
*   \`symbol\`
*   \`bigint\`

**Key Behavior: Passed by Value**

When you assign a primitive variable to another variable, a **copy** of the value is made. They are completely independent.

\`\`\`javascript
// Passed by Value
let a = 100;
let b = a; // A copy of the value 100 is assigned to b.

console.log(a); // 100
console.log(b); // 100

// Now, let's change b
b = 200;

console.log(a); // 100 (a is completely unaffected)
console.log(b); // 200
\`\`\`

---

#### Object (Reference) Types

Objects are more complex data structures. This category includes \`Object\`, \`Array\`, \`Function\`, \`Date\`, etc. They are **mutable**, meaning their internal state or properties can be changed.

**Key Behavior: Passed by Reference**

When you assign an object variable to another, you are not copying the object itself. Instead, you are copying the **reference** (or the pointer) to the location of the object in memory. Both variables point to the exact same object.

\`\`\`javascript
// Passed by Reference
let person1 = {
  name: "Ibrahem",
  age: 30
};

// A copy of the REFERENCE is made. Both variables point to the SAME object.
let person2 = person1;

console.log(person1.name); // "Ibrahem"
console.log(person2.name); // "Ibrahem"

// Now, let's change a property using person2
person2.name = "Ali";

// The change is reflected in BOTH variables because they point to the same object.
console.log(person1.name); // "Ali" (person1 was also changed!)
console.log(person2.name); // "Ali"
\`\`\`

A common point of confusion is re-assignment. If you assign a completely new object to \`person2\`, you are only changing the reference for \`person2\`, which breaks the link to the original object.

\`\`\`javascript
person2 = { name: "Fatima", age: 25 }; // person2 now points to a new object

console.log(person1.name); // "Ali" (person1 is unaffected by the re-assignment)
console.log(person2.name); // "Fatima"
\`\`\`

---

### Summary

| Characteristic | Primitive Types | Object (Reference) Types |
| :--- | :--- | :--- |
| **Storage** | Stored directly in the variable | Variable stores a reference (pointer) to the object's memory location |
| **Assignment** | **Pass by Value** (a copy is made) | **Pass by Reference** (the pointer is copied) |
| **Mutability** | **Immutable** (cannot be changed) | **Mutable** (properties can be changed) |
| **Comparison (\`===\`)**| Compares the actual values | Compares if the references point to the same object in memory |`,
    ['data-types', 'primitives', 'objects', 'reference', 'value'],
    'beginner'
  ),

  topic(
    'Equality: == vs. ===',
    `### Equality: \`==\` (Loose) vs. \`===\` (Strict)

In JavaScript, \`==\` and \`===\` are used to compare two values, but they do so in fundamentally different ways. The key difference is that \`==\` performs **type coercion**, while \`===\` does not.

---

#### \`==\` (Loose Equality)

The \`==\` operator compares two values for equality **after** converting both values to a common type. This is called type coercion. This can lead to unpredictable and often buggy results because the conversion rules are complex.

**How it works:**
1.  Are the types the same? If yes, compare the values (like \`===\`).
2.  If the types are different, attempt to convert one or both values to a common type.
3.  Compare the converted values.

**Examples of unexpected behavior:**
\`\`\`javascript
'1' == 1;         // true (string '1' is converted to number 1)
true == 1;        // true (boolean true is converted to number 1)
null == undefined; // true (this is a specific rule in the spec)
0 == false;       // true (boolean false is converted to number 0)
'' == false;      // true (empty string is converted to number 0)
[10] == 10;       // true (array is converted to string '10', then to number 10)
\`\`\`
Because of these automatic conversions, loose equality is often considered unsafe and is a common source of bugs.

---

#### \`===\` (Strict Equality)

The \`===\` operator compares two values for equality **without** performing any type conversion. It checks if both the **type** and the **value** are identical.

**How it works:**
1.  Are the types the same? If no, return \`false\`.
2.  If the types are the same, are the values the same?
    *   For primitives (number, string, boolean), it checks if the values are identical.
    *   For objects (including arrays), it checks if the variables reference the **exact same object** in memory.

**Examples:**
\`\`\`javascript
'1' === 1;         // false (string vs. number)
true === 1;        // false (boolean vs. number)
null === undefined; // false (null vs. undefined)
0 === false;       // false (number vs. boolean)

const obj1 = {};
const obj2 = {};
obj1 === obj2; // false (they are two different objects in memory)

const obj3 = obj1;
obj1 === obj3; // true (they both reference the same object)
\`\`\`

---

### Best Practice

**Always use \`===\` (Strict Equality).**

It is predictable, safe, and avoids the need to memorize JavaScript's complex type coercion rules. There are very few situations where \`==\` is genuinely useful (the most common argument is \`variable == null\`, which checks for both \`null\` and \`undefined\`, but this can also be confusing). Using \`===\` makes your code more robust and easier to understand.`,
    ['equality', 'comparison', 'type-coercion'],
    'beginner'
  ),

  topic(
    'Type Coercion',
    `### Type Coercion

Type coercion is the automatic or implicit conversion of values from one data type to another by the JavaScript engine. This happens when you use operators on values of different types.

While it can make the language feel flexible, it's also a major source of bugs if you don't understand its rules.

---

#### 1. Coercion to a String

This is the most common and straightforward type of coercion. When the \`+\` operator is used with a string and any other type, the other type is converted to a string.

\`\`\`javascript
// The \`+\` operator triggers string coercion
"Hello " + 42;          // "Hello 42"
"5" + 5;                // "55" (not 10)
"The result is " + true; // "The result is true"
"items: " + [1, 2, 3];  // "items: 1,2,3"
\`\`\`

---

#### 2. Coercion to a Number

Numeric coercion happens when an operator other than \`+\` is used with a value that can be converted to a number. This includes arithmetic operators (\`-\`, \`*\`, \`/\`, \`%\`) and comparison operators.

\`\`\`javascript
// Arithmetic operators trigger number coercion
'10' - 5;       // 5  (string '10' becomes number 10)
'100' * '2';    // 200
'10' > 5;       // true (string '10' becomes number 10)

// Special cases
true - 1;       // 0 (true becomes 1)
false + 1;      // 1 (false becomes 0)
'five' * 2;     // NaN (Not a Number), because 'five' cannot be converted to a number
\`\`\`
Note: \`null\` is coerced to \`0\`, while \`undefined\` is coerced to \`NaN\`.

---

#### 3. Coercion to a Boolean (Truthy and Falsy)

Boolean coercion happens in logical contexts, such as an \`if\` statement or with logical operators (\`&&\`, \`||\`, \`!\`). Every value in JavaScript has an inherent "truthiness".

**Falsy Values**
There are only a handful of values that are coerced to \`false\`. You should memorize these:

*   \`false\`
*   \`0\` (and \`-0\`)
*   \`""\` (empty string)
*   \`null\`
*   \`undefined\`
*   \`NaN\` (Not a Number)

**Truthy Values**
Any value that is not on the "falsy" list is considered **truthy**. This includes:

*   \`"hello"\` (any non-empty string)
*   \`1\` (any non-zero number)
*   \`[]\` (an empty array)
*   \`{}\` (an empty object)
*   \`function() {}\` (any function)

**Example:**
\`\`\`javascript
if ("hello") {
  // This code runs, because "hello" is truthy
}

if (0) {
  // This code does NOT run, because 0 is falsy
}

console.log(!'');       // true (the opposite of the falsy empty string)
console.log(!!'hello');  // true (a common way to explicitly coerce to a boolean)
\`\`\`

---

### Why It Matters

*   **Loose Equality (\`==\`):** Type coercion is the reason \`==\` is unpredictable. It tries to convert types before comparing, leading to results like \`'1' == 1\`.
*   **Bugs:** Unintended coercion can lead to silent errors. For example, getting \`"5" + 5 = "55"\` when you expected \`10\` from form inputs.

**Best Practice:** Be aware that coercion exists. For clarity and safety, perform **explicit** type conversions (e.g., using \`Number()\`, \`String()\`, \`Boolean()\`) instead of relying on JavaScript's implicit rules.`,
    ['type-coercion', 'truthy', 'falsy', 'conversion'],
    'beginner'
  ),
]);

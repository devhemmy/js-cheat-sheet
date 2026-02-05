import { category, topic } from '../../utils/topicHelpers';

export const fundamentals = category('TypeScript Fundamentals', [
  topic(
    'What is TypeScript?',
    `### What is TypeScript?

TypeScript is a programming language developed by Microsoft that builds on top of JavaScript. It is a "syntactic superset" of JavaScript, which means all valid JavaScript code is also valid TypeScript code. TypeScript's primary addition to JavaScript is static typing.

---

#### Relationship to JavaScript

*   **Superset, Not a Replacement:** TypeScript doesn't replace JavaScript. Instead, you write TypeScript code, which is then "transpiled" (compiled) into plain JavaScript that can run in any browser or Node.js environment.
*   **Compatibility:** You can gradually introduce TypeScript into an existing JavaScript project. It seamlessly works with all existing JavaScript libraries and code.

---

#### Benefits of Static Typing

In JavaScript, a variable's type can change unexpectedly (dynamic typing). TypeScript allows you to declare a variable's type upfront (static typing), which prevents many common bugs.

The main benefits are:

*   **Early Error Detection:** TypeScript's compiler catches type-related errors during development, before the code is ever run. This prevents bugs that might otherwise only appear for users in production.
*   **Improved Readability and Documentation:** Explicitly stating types makes your code clearer and easier for other developers (or your future self) to understand. The types serve as a form of documentation.
*   **Better Tooling and Autocomplete:** IDEs and code editors can use type information to provide smarter autocompletion, error checking, and safer code refactoring.

---

#### Example: The Core Difference

Here is a simple function in both JavaScript and TypeScript that shows the benefit.

**JavaScript (Dynamic Typing)**
\`\`\`javascript
function greet(person, date) {
  console.log(\`Hello \${person}, today is \${date}!\`);
}

greet("Brendan", new Date()); // Works as expected

// BUG: This will run without error, but produce a weird result.
// The .toDateString() method doesn't exist on a string.
greet("Brendan", "01/01/2023"); // "Hello Brendan, today is 01/01/2023!"
\`\`\`
The bug in the second function call might go unnoticed and cause problems later.

**TypeScript (Static Typing)**

In TypeScript, we add "type annotations" to the function parameters.

\`\`\`typescript
function greet(person: string, date: Date) {
  console.log(\`Hello \${person}, today is \${date.toDateString()}!\`);
}

greet("Brendan", new Date()); // Works as expected

// ERROR: This line will show an error *before you run the code*.
// Argument of type 'string' is not assignable to parameter of type 'Date'.
greet("Brendan", "01/01/2023");
\`\`\`

TypeScript identifies the error immediately, preventing the bug from ever making it into the application.`,
    ['typescript', 'introduction', 'types', 'static-typing'],
    'beginner'
  ),

  topic(
    'Core Types',
    `### Core Types

TypeScript provides several built-in types for basic values. These annotations are used after a variable or function parameter, preceded by a colon (:).

| Type | Description | Example |
| :--- | :--- | :--- |
| \`string\` | Represents text values. | \`let name: string = "Alice";\` |
| \`number\` | Represents all numbers (integers and floats). | \`let age: number = 30;\` |
| \`boolean\` | Represents \`true\` or \`false\` values. | \`let isLoggedIn: boolean = true;\` |
| \`Array\` | Represents an array of values of a specific type. Written as \`Type[]\` or \`Array<Type>\`. | \`let list: number[] = [1, 2, 3];\` |
| \`any\` | Opt-out of type checking. Allows any value. Use it sparingly as it defeats the purpose of TypeScript. | \`let flexible: any = "hello";\` |
| \`unknown\` | A type-safe alternative to \`any\`. You must perform a type check before using the variable. | \`let data: unknown = getFromAPI();\` |
| \`void\` | Represents the absence of a value, typically used for functions that don't return anything. | \`function log(msg: string): void { ... }\` |
| \`never\` | Represents a value that will never occur. Used for functions that always throw an error or never end. | \`function error(): never { throw new Error(); }\` |

---

#### Key Concepts

**Type Safety:** TypeScript helps you avoid mistakes by ensuring you don't assign a value of the wrong type to a variable.

\`\`\`typescript
let name: string = "Alice";
// ERROR: Type 'number' is not assignable to type 'string'.
name = 123;
\`\`\`

**\`any\` vs. \`unknown\`:**

*   With \`any\`, you can perform any operation without checks, which is risky.
*   With \`unknown\`, TypeScript forces you to narrow the type before you can use it, which is much safer.

\`\`\`typescript
let value: unknown = "hello world";

// ERROR: 'value' is of type 'unknown'.
// value.toUpperCase();

if (typeof value === "string") {
  // OK: TypeScript now knows 'value' is a string in this block.
  console.log(value.toUpperCase());
}
\`\`\``,
    ['typescript', 'types', 'primitives', 'any', 'unknown'],
    'beginner'
  ),

  topic(
    'Type Annotations & Inference',
    `### Type Annotations & Inference

TypeScript has two ways of knowing a variable's type: explicitly telling it (annotation) or letting it figure it out on its own (inference).

---

#### 1. Type Annotation (Explicit)

This is when you explicitly tell TypeScript the type of a variable using the colon (:) syntax.

**When to use it:**

*   When you declare a variable but don't initialize it immediately.
*   For function parameters and return values to define a clear contract.
*   When you want to override a type that TypeScript might infer incorrectly.

\`\`\`typescript
// Annotation for a variable
let name: string;
name = "Alice";

// Annotation for function parameters and return value
function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

---

#### 2. Type Inference (Implicit)

This is when TypeScript automatically deduces the type of a variable based on the value you assign to it at declaration. This keeps your code cleaner.

\`\`\`typescript
// Inferred as \`string\` because it's initialized with a string
let greeting = "hello";

// Inferred as \`number\`
let age = 30;
\`\`\`

If you try to assign a different type later, TypeScript will still throw an error because the type was "locked in" at initialization.

\`\`\`typescript
let age = 30; // TypeScript infers 'age' is of type 'number'

// ERROR: Type 'string' is not assignable to type 'number'.
age = "thirty";
\`\`\`

---

#### Best Practice

*   Rely on inference whenever possible for cleaner code (e.g., \`let name = "Bob"\` is better than \`let name: string = "Bob"\`).
*   Use annotations for function signatures and when you are not initializing a variable right away. This makes your code's intentions clear.`,
    ['typescript', 'annotations', 'inference', 'types'],
    'beginner'
  ),

  topic(
    'Interfaces vs. Type Aliases',
    `### Interfaces vs. Type Aliases

Both \`interface\` and \`type\` aliases are used to define the "shape" of an object or a reusable type. For simple object shapes, they are very similar, but they have key differences.

---

#### 1. Type Alias

A type alias gives a new name to any type, including primitives, unions, or objects. It is defined with the \`type\` keyword.

\`\`\`typescript
// For a complex object
type Person = {
  name: string;
  age: number;
  isStudent?: boolean; // Optional property
};

// For a union of types
type StringOrNumber = string | number;

// For a primitive
type UserID = string;
\`\`\`

---

#### 2. Interface

An interface is a way to define a contract for an object's shape. It can only be used for objects, not primitives. It is defined with the \`interface\` keyword.

\`\`\`typescript
interface Person {
  name: string;
  age: number;
  isStudent?: boolean; // Optional property
}

// You can extend an interface
interface Employee extends Person {
  employeeId: number;
}
\`\`\`

---

#### Key Differences

| Feature | \`interface\` | \`type\` Alias |
| :--- | :--- | :--- |
| **Can Define** | Only object shapes. | Any type (objects, primitives, unions, etc.). |
| **Extending** | Uses the \`extends\` keyword. | Uses intersection types (\`&\`). \`type Employee = Person & { employeeId: number };\` |
| **Declaration Merging** | Yes. An interface can be defined multiple times and will be merged. | No. You cannot declare the same type alias more than once. |

---

#### Declaration Merging Example (Interface Only)

You can add new properties to an existing interface, which is useful when working with third-party libraries.

\`\`\`typescript
interface User {
  name: string;
}

// Later in the code...
interface User {
  age: number;
}

const myUser: User = { name: "Alice", age: 30 }; // This is valid
\`\`\`

---

#### When to Use Which? (Best Practice)

*   Use **\`interface\`** when defining the shape of objects or when you might need its extensibility features (like declaration merging). It's the common choice for object-oriented programming with classes.
*   Use **\`type\`** when you need to define a union, intersection, tuple, or a named primitive. It is more versatile for non-object types.`,
    ['typescript', 'interfaces', 'type-aliases', 'objects'],
    'intermediate'
  ),
]);

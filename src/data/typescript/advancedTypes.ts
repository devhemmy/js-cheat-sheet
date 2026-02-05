import { category, topic } from '../../utils/topicHelpers';

export const advancedTypes = category('Advanced Types & Features', [
  topic(
    'Union & Intersection Types',
    `### Union & Intersection Types

These are powerful features for combining existing types to create new, more flexible ones.

---

#### 1. Union Types (\`|\`)

A union type allows a variable to be one of several possible types. It's like an "OR" condition.

**Use Case:** When a value can be one of a few different, known types. For example, a function that accepts either a string or a number.

\`\`\`typescript
function printId(id: string | number) {
  // TypeScript will show an error if you try to use a method
  // that doesn't exist on BOTH types.
  // console.log(id.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'number'.

  // You must use a type guard to narrow the type first.
  if (typeof id === "string") {
    // Inside this block, TypeScript knows 'id' is a string.
    console.log(id.toUpperCase());
  } else {
    // Here, it knows 'id' is a number.
    console.log(id);
  }
}

printId(101);       // Prints "101"
printId("202-A");   // Prints "202-A"
\`\`\`

---

#### 2. Intersection Types (\`&\`)

An intersection type combines multiple types into a single one that has all the properties of the combined types. It's like an "AND" condition.

**Use Case:** To merge different object shapes into a new, combined shape.

\`\`\`typescript
type Draggable = {
  drag: () => void;
};

type Resizable = {
  resize: () => void;
};

// This new type has ALL properties of Draggable AND Resizable.
type UIWidget = Draggable & Resizable;

let textBox: UIWidget = {
  drag: () => console.log("Dragging..."),
  resize: () => console.log("Resizing..."),
};

textBox.drag();
textBox.resize();
\`\`\`

---

#### Summary

| Type | Symbol | Analogy | Meaning |
| :--- | :---: | :--- | :--- |
| **Union** | \`|\` | OR | The value can be **one of** the types. |
| **Intersection** | \`&\` | AND | The object must have **all of** the properties. |`,
    ['typescript', 'union', 'intersection', 'types'],
    'intermediate'
  ),

  topic(
    'Generics',
    `### Generics

Generics are a powerful feature that allows you to create reusable components, functions, and data structures that can work with a variety of types instead of being limited to a single one. You can think of them as **variables for types**.

The syntax uses angle brackets with a type variable, commonly \`<T>\` (for Type).

---

#### The Problem Generics Solve

Without generics, you have two bad options for creating a flexible function:

1.  **Use \`any\`:** This is not type-safe and defeats the purpose of TypeScript.
2.  **Write a separate function for each type:** This leads to a lot of duplicate code.

---

#### Example: A Simple Generic Function

Let's create a function that takes an argument and returns it wrapped in an array.

**Without Generics (using \`any\`) - Bad**

\`\`\`typescript
function wrapInArray(input: any): any[] {
  return [input];
}

const numbers = wrapInArray(10); // Type is any[]. We lose the type info.
const strings = wrapInArray("hello"); // Type is any[].
\`\`\`

We don't know what's in the array afterwards. \`numbers[0].toFixed(2)\` would not be suggested by autocomplete.

**With Generics - Good**

\`\`\`typescript
function wrapInArray<T>(input: T): T[] {
  return [input];
}

// TypeScript infers the type of T based on the input
const numbers = wrapInArray(10); // Type is number[]. Type info is kept!
const strings = wrapInArray("hello"); // Type is string[].

// You can also explicitly set the type
const booleans = wrapInArray<boolean>(true); // Type is boolean[].
\`\`\`

With generics, TypeScript knows the exact type of the returned array, preserving type safety and enabling better tooling.

---

#### Generics with Interfaces and Types

Generics are also commonly used with interfaces and type aliases to create flexible data structures.

\`\`\`typescript
// A generic interface for a standard API response
interface ApiResponse<T> {
  data: T;
  isError: boolean;
}

// We can reuse this interface for different data payloads
type UserResponse = ApiResponse<{ name: string; id: number }>;
type ProductResponse = ApiResponse<{ title: string; price: number }>;

const user: UserResponse = {
  data: { name: "Alice", id: 1 },
  isError: false,
};

const product: ProductResponse = {
  data: { title: "Book", price: 20 },
  isError: false,
};
\`\`\``,
    ['typescript', 'generics', 'type-variables', 'reusability'],
    'intermediate'
  ),

  topic(
    'Enums',
    `### Enums

Enums (enumerations) allow you to define a set of named constants, making your code more readable and less prone to errors from using raw numbers or strings.

---

#### Why Use Enums?

*   **Readability:** Replaces "magic numbers" or strings with meaningful names. \`if (status === 0)\` becomes \`if (status === OrderStatus.Pending)\`.
*   **Type Safety:** Restricts a variable to a specific set of allowed values, preventing typos and invalid inputs.
*   **Maintainability:** If a value needs to change, you only have to update it in one place (the enum definition).

TypeScript offers two main types of enums: numeric and string.

---

#### 1. Numeric Enums

By default, enums assign incrementing numbers starting from 0.

\`\`\`typescript
enum OrderStatus {
  Pending,    // 0
  Shipped,    // 1
  Delivered,  // 2
  Cancelled   // 3
}

let myOrder = OrderStatus.Delivered;
console.log(myOrder); // Output: 2
\`\`\`

You can also manually set the starting number.

\`\`\`typescript
enum Direction {
  Up = 1,
  Down,     // 2
  Left,     // 3
  Right     // 4
}
\`\`\`

---

#### 2. String Enums

In a string enum, you explicitly assign string values to each member. This is often preferred because the values are readable and meaningful when debugging.

\`\`\`typescript
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER"
}

function checkPermissions(role: UserRole) {
  if (role === UserRole.Admin) {
    console.log("Full access granted.");
  }
}

checkPermissions(UserRole.Admin); // "Full access granted."
\`\`\`

---

#### Best Practice

*   **Prefer String Enums**: They provide more meaningful, readable values at runtime, which simplifies debugging.`,
    ['typescript', 'enums', 'constants'],
    'beginner'
  ),

  topic(
    'Type Guards & Narrowing',
    `### Type Guards & Narrowing

When working with union types (e.g., \`string | number\`), TypeScript needs a way to know which specific type a variable is within a certain block of code. **Narrowing** is the process of refining a broad type into a more specific one. **Type guards** are expressions that perform a runtime check to guarantee the type in a specific scope, allowing TypeScript to narrow it down.

Here are the most common type guards:

---

#### 1. \`typeof\` Type Guard

This is the most common way to narrow primitive types like \`string\`, \`number\`, \`boolean\`, \`object\`, \`function\`, \`symbol\`, and \`undefined\`.

\`\`\`typescript
function processInput(input: string | number) {
  if (typeof input === "string") {
    // TypeScript now knows 'input' is a string.
    console.log(input.toUpperCase());
  } else {
    // TypeScript knows 'input' must be a number here.
    console.log(input.toFixed(2));
  }
}
\`\`\`

---

#### 2. \`instanceof\` Type Guard

The \`instanceof\` operator checks if an object is an instance of a specific class or constructor function. This is useful for narrowing down object types.

\`\`\`typescript
class Dog {
  bark() { console.log("Woof!"); }
}
class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    // TypeScript knows 'pet' is a Dog.
    pet.bark();
  } else {
    // TypeScript knows 'pet' is a Cat.
    pet.meow();
  }
}
\`\`\`

---

#### 3. Truthiness Narrowing

This simple guard checks if a value is "truthy" (not \`null\`, \`undefined\`, \`false\`, \`0\`, \`""\`, or \`NaN\`). It's a quick way to filter out \`null\` and \`undefined\`.

\`\`\`typescript
function print(value?: string | null) {
  if (value) {
    // TypeScript knows 'value' is a string here,
    // because it filtered out null and undefined.
    console.log(value.length);
  }
}
\`\`\`

---

#### 4. User-Defined Type Guards

For complex checks, you can create a custom type guard function. This is a function that returns a special type predicate: \`parameterName is Type\`.

\`\`\`typescript
// Define a custom type for a Car
interface Car {
  drive: () => void;
}

// User-defined type guard function
function isCar(vehicle: any): vehicle is Car {
  return typeof (vehicle as Car).drive === 'function';
}

function operate(vehicle: any) {
  if (isCar(vehicle)) {
    // TypeScript now knows 'vehicle' is of type Car.
    vehicle.drive();
  }
}
\`\`\``,
    ['typescript', 'type-guards', 'narrowing', 'typeof', 'instanceof'],
    'intermediate'
  ),

  topic(
    'Utility Types',
    `### Utility Types

Utility types are built-in helpers in TypeScript that let you transform one type into another. This is useful for creating variations of existing types without having to write them from scratch.

Here are some of the most common and useful utility types:

---

#### 1. \`Partial<T>\`

Constructs a type with all properties of \`T\` set to optional. This is great for functions that update an object, where you only need to provide the properties that are changing.

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function updateUser(update: Partial<User>) {
  // ...logic to update user
}

// All of these are valid:
updateUser({ name: "Alice" });
updateUser({ age: 31 });
updateUser({ name: "Bob", age: 40 });
\`\`\`

---

#### 2. \`Readonly<T>\`

Constructs a type where all properties of \`T\` are set to \`readonly\`. This prevents you from re-assigning the properties of an object, helping enforce immutability.

\`\`\`typescript
interface Config {
  apiUrl: string;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.example.com",
};

// ERROR: Cannot assign to 'apiUrl' because it is a read-only property.
// config.apiUrl = "new-url";
\`\`\`

---

#### 3. \`Pick<T, K>\`

Constructs a type by picking a set of properties \`K\` (a string literal or union of string literals) from \`T\`. This is useful for creating a smaller, more specific type from a larger one.

\`\`\`typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Create a new type with only 'title' and 'completed'
type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
\`\`\`

---

#### 4. \`Omit<T, K>\`

Constructs a type by picking all properties from \`T\` and then removing the keys \`K\`. It's the opposite of \`Pick\`.

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Create a public user type without sensitive info
type PublicUser = Omit<User, "passwordHash">;

const user: PublicUser = {
  id: "123",
  name: "Alice",
  email: "alice@example.com",
};
\`\`\``,
    ['typescript', 'utility-types', 'partial', 'readonly', 'pick', 'omit'],
    'intermediate'
  ),
]);

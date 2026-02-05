import { category, topic } from '../../utils/topicHelpers';

export const oopJavaScript = category('Object-Oriented JavaScript', [
  topic(
    'Prototypal Inheritance',
    `### Prototypal Inheritance

Prototypal Inheritance is the core mechanism in JavaScript through which objects inherit properties and methods from other objects. Unlike class-based languages (like Java or C++), JavaScript's inheritance model is simpler: **objects inherit directly from other objects.**

---

#### The Prototype Chain

Every JavaScript object has a hidden internal property, \`[[Prototype]]\`, which is a reference (a link) to another object. This other object is called its **prototype**. That prototype object has its *own* prototype, and so on, until an object is reached with \`null\` as its prototype. This linked series of objects is called the **prototype chain**.

When you try to access a property on an object, the JavaScript engine follows these steps:
1.  It checks if the property exists directly on the object itself.
2.  If not found, it follows the \`[[Prototype]]\` link to the next object in the chain and checks for the property there.
3.  This process continues up the chain until the property is found or the end of the chain (\`null\`) is reached. If the property is never found, the result is \`undefined\`.

\`Object.prototype\` is the base object at the top of almost every prototype chain. It provides common methods like \`.toString()\`, \`.hasOwnProperty()\`, etc.

---

#### How to Create Inheritance

There are three primary ways to set up the prototype chain.

**1. \`Object.create()\` (The Modern Way)**

This is the most direct method. \`Object.create(proto)\` creates a new empty object whose \`[[Prototype]]\` is set to the \`proto\` object you provide.

\`\`\`javascript
// 1. The prototype object (the object we want to inherit from)
const animal = {
  eat: function() {
    console.log("Eating...");
  },
  sleep: function() {
    console.log("Sleeping...");
  }
};

// 2. Create a new object that inherits from \`animal\`
const dog = Object.create(animal);
dog.bark = function() {
  console.log("Woof! Woof!");
};

// 3. Using the methods
dog.eat();   // "Eating..." -> Found on the \`animal\` prototype
dog.bark();  // "Woof! Woof!" -> Found directly on \`dog\`

// Checking properties
console.log(dog.hasOwnProperty('bark')); // true (it's dog's own property)
console.log(dog.hasOwnProperty('eat'));  // false (it's an inherited property)
\`\`\`

**2. Constructor Functions (The "Old" Way)**

Before ES6 classes, this was the standard way to mimic classes. When a function is called with the \`new\` keyword, the new object's \`[[Prototype]]\` is automatically linked to the constructor function's \`.prototype\` property.

\`\`\`javascript
// Constructor function
function Animal(name) {
  this.name = name;
}

// Add methods to the constructor's prototype property
Animal.prototype.eat = function() {
  console.log(\`\${this.name} is eating.\`);
};

// \`new\` links the new object's prototype to Animal.prototype
const cat = new Animal('Whiskers');
cat.eat(); // "Whiskers is eating."
\`\`\`

**3. ES6 \`class\` Syntax (Syntactic Sugar)**

The \`class\` syntax, introduced in ES6, provides a cleaner, more familiar syntax for setting up prototypal inheritance. Under the hood, it still uses the same prototypal model. The \`extends\` keyword automatically sets up the prototype chain.

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(\`\${this.name} is eating.\`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const myDog = new Dog('Rex');
myDog.eat();  // "Rex is eating." -> Inherited from Animal
myDog.bark(); // "Woof! Woof!" -> Own method
\`\`\``,
    ['prototypes', 'inheritance', 'oop', 'object-create'],
    'intermediate'
  ),

  topic(
    'Constructors and the new keyword',
    `### Constructors and the \`new\` keyword

In JavaScript, a **constructor function** is a regular function used to create and initialize multiple objects of the same type. The \`new\` keyword is the operator used to invoke a function as a constructor.

This pattern was the standard way to create "classes" of objects before the \`class\` syntax was introduced in ES6.

---

#### What is a Constructor Function?

By convention, constructor functions start with a capital letter (e.g., \`Person\`, \`Car\`). They are designed to be called with the \`new\` keyword. Inside the function, the \`this\` keyword refers to the new object being created.

\`\`\`javascript
// This is a constructor function
function Person(firstName, lastName) {
  // \`this\` refers to the new empty object being created

  // 1. Add properties to the new object
  this.firstName = firstName;
  this.lastName = lastName;
}
\`\`\`

---

#### What Does the \`new\` Keyword Do?

When you call a function using the \`new\` keyword (e.g., \`new Person(...)\`), it triggers a special four-step process:

1.  **Creates a New Empty Object:** A new, plain JavaScript object is created in memory (e.g., \`{}\`).
2.  **Sets the Prototype:** The new object's internal \`[[Prototype]]\` property is linked to the constructor function's \`prototype\` property. This is how the new object inherits methods (e.g., \`newObject.[[Prototype]] = Person.prototype\`).
3.  **Binds \`this\`:** The \`this\` keyword inside the constructor function is set to point to the newly created object. This allows the function to add properties and methods to the new object.
4.  **Returns the Object:** The new object is returned automatically from the function. (The only exception is if the function explicitly returns a different object).

---

#### Putting It All Together: An Example

Let's add a shared method to our \`Person\` constructor's prototype. Methods should be placed on the \`.prototype\` property so that all instances share the same function in memory, which is more efficient.

\`\`\`javascript
function Person(firstName, lastName) {
  // \`this\` is bound to the new object
  this.firstName = firstName;
  this.lastName = lastName;
}

// Add a method to the prototype.
// All instances created by \`new Person\` will share this method.
Person.prototype.getFullName = function() {
  return \`\${this.firstName} \${this.lastName}\`;
};

// Use the \`new\` keyword to create instances (objects)
const person1 = new Person('Ibrahem', 'Bastawi');
const person2 = new Person('John', 'Doe');

// Call the methods
console.log(person1.getFullName()); // "Ibrahem Bastawi"
console.log(person2.getFullName()); // "John Doe"

// Checking the prototype chain
console.log(person1 instanceof Person); // true
console.log(Object.getPrototypeOf(person1) === Person.prototype); // true
\`\`\`

In this example:
*   \`person1\` and \`person2\` are two distinct objects.
*   Each has its own \`firstName\` and \`lastName\` properties.
*   However, they both share the *exact same* \`getFullName\` function through their link to \`Person.prototype\`.

This pattern provides a blueprint for creating objects, which is the foundation of object-oriented programming in classic JavaScript. The ES6 \`class\` syntax is largely "syntactic sugar" that simplifies this exact process.`,
    ['constructors', 'new', 'oop', 'prototypes'],
    'intermediate'
  ),

  topic(
    'ES6 Classes',
    `### ES6 Classes

The \`class\` syntax was introduced in ES6 to provide a cleaner, more modern, and more familiar way to create objects and handle inheritance in JavaScript. It is important to know that ES6 classes are primarily **syntactic sugar** over JavaScript's existing prototypal inheritance model. They do not introduce a new object-oriented inheritance model.

---

#### Basic Class Syntax

A class is a blueprint for creating objects. It encapsulates data (properties) and behavior (methods).

*   **\`class\` keyword:** Used to declare a class.
*   **\`constructor()\` method:** A special method for creating and initializing an object created with a class. It is called automatically when an instance of the class is created with \`new\`. There can only be one \`constructor\` per class.
*   **Methods:** Declared directly inside the class body. These methods are automatically added to the class's prototype.

\`\`\`javascript
class Person {
  // The constructor is called when we do \`new Person(...)\`
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // This is a method. It will be added to Person.prototype
  greet() {
    console.log(\`Hello, my name is \${this.name} and I am \${this.age} years old.\`);
  }
}

// Create an instance (an object) of the Person class
const ibrahem = new Person('Ibrahem', 30);
ibrahem.greet(); // "Hello, my name is Ibrahem and I am 30 years old."
\`\`\`

This syntax is equivalent to the constructor function pattern but is much more organized and readable.

---

#### Inheritance with \`extends\` and \`super\`

ES6 classes make inheritance straightforward using the \`extends\` and \`super\` keywords.

*   **\`extends\`:** Used to create a child class that inherits from a parent class. The child class gets access to all the properties and methods of the parent.
*   **\`super\`:** A special keyword with two main uses:
    1.  **\`super()\` in a constructor:** Used to call the parent class's constructor. You **must** call \`super()\` in a child class constructor *before* using the \`this\` keyword.
    2.  **\`super.methodName()\`:** Used to call a method from the parent class.

**Example:**

\`\`\`javascript
// Parent Class
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a noise.\`);
  }
}

// Child Class inheriting from Animal
class Dog extends Animal {
  constructor(name, breed) {
    // 1. Call the parent constructor with super()
    super(name);
    this.breed = breed;
  }

  // 2. Override the parent's speak method
  speak() {
    // 3. Optionally, call the parent method with super.speak()
    super.speak();
    console.log(\`\${this.name} barks.\`);
  }
}

const myDog = new Dog('Rex', 'German Shepherd');
myDog.speak();
// Output:
// "Rex makes a noise."
// "Rex barks."
\`\`\`

---

#### Key Takeaways

*   **Syntactic Sugar:** Classes are a cleaner syntax for the same prototypal inheritance that has always existed in JavaScript.
*   **Clarity:** They provide a more structured and less error-prone way to create blueprints for objects.
*   **\`constructor\`:** The special initialization method.
*   **\`extends\`:** The keyword for inheritance.
*   **\`super\`:** The keyword to access the parent class's constructor and methods.
*   **Hoisting:** Unlike function declarations, class declarations are **not** hoisted. You must declare a class before you can use it.`,
    ['classes', 'es6', 'oop', 'inheritance', 'extends', 'super'],
    'intermediate'
  ),
]);

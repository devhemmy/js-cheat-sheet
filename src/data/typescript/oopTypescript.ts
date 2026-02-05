import { category, topic } from '../../utils/topicHelpers';

export const oopTypescript = category('Object-Oriented TypeScript', [
  topic(
    'Classes: Enhancing JavaScript with Access Modifiers',
    `### Classes: Enhancing JavaScript with Access Modifiers

TypeScript adopts standard JavaScript (ES6) classes but enhances them with powerful features from object-oriented programming, most notably **access modifiers**. These modifiers control the visibility and accessibility of class members (properties and methods), a concept that doesn't exist in standard JavaScript.

The primary purpose of access modifiers is to achieve **encapsulation**—bundling data and the methods that operate on that data together, while restricting direct access to some of the object's components.

There are three main access modifiers: \`public\`, \`private\`, and \`protected\`.

---

#### 1. \`public\`

**Description:** Members are accessible from anywhere, both inside and outside the class.

**Default Behavior:** If you don't specify any modifier, the member is \`public\` by default.

\`\`\`typescript
class Animal {
  public name: string;

  public constructor(theName: string) {
    this.name = theName;
  }

  public move(distanceInMeters: number) {
    console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
  }
}

let cat = new Animal("Cat");
cat.move(10); // Accessible from outside the class
console.log(cat.name); // Accessible from outside the class
\`\`\`

---

#### 2. \`private\`

**Description:** Members are only accessible from within the class where they are defined. This is the strictest modifier.

**Use Case:** Hiding internal state or helper methods that should not be manipulated from outside the class.

\`\`\`typescript
class Person {
  private ssn: string;

  constructor(ssn: string) {
    this.ssn = ssn;
  }

  public getSSN(): string {
    // We can access it from a public method inside the class.
    return this.ssn;
  }
}

let person = new Person("123-45-678");
// ERROR: Property 'ssn' is private and only accessible within class 'Person'.
// console.log(person.ssn);

console.log(person.getSSN()); // OK
\`\`\`

---

#### 3. \`protected\`

**Description:** Members are accessible within the class they are defined in and by any subclasses (child classes) that inherit from it. They cannot be accessed from outside instances.

**Use Case:** Sharing properties or methods with child classes while still hiding them from the public interface.

\`\`\`typescript
class Vehicle {
  protected speed: number;

  constructor() {
    this.speed = 0;
  }
}

class Car extends Vehicle {
  public accelerate() {
    // Child class 'Car' can access the protected member 'speed'.
    this.speed += 10;
    console.log(\`Speed is now \${this.speed} km/h\`);
  }
}

let car = new Car();
car.accelerate(); // OK

// ERROR: Property 'speed' is protected and only accessible within
// class 'Vehicle' and its subclasses.
// console.log(car.speed);
\`\`\``,
    ['typescript', 'classes', 'access-modifiers', 'oop', 'encapsulation'],
    'intermediate'
  ),

  topic(
    'Interfaces: Enforcing a Structure on a Class',
    `### Interfaces: Enforcing a Structure on a Class

In TypeScript, an interface can be used to define a "contract" or a specific structure that a class must follow. When a class **implements** an interface, it is required to provide a concrete implementation for all the properties and methods declared in that interface.

This is one of the most common uses of interfaces in object-oriented programming. It ensures that different classes can be used interchangeably if they all adhere to the same contract.

---

#### How it Works: The \`implements\` Keyword

You use the \`implements\` keyword to make a class adhere to an interface. If the class fails to correctly implement all the members of the interface, TypeScript will generate an error at compile time.

---

#### Example

Let's define a contract for things that can be logged.

\`\`\`typescript
// 1. Define the Interface (the contract)
interface ILoggable {
  // Any class implementing this must have a 'log' method
  // that takes a string and returns nothing (void).
  log(message: string): void;
}

// 2. Implement the Interface in different classes

// A class for logging to the console
class ConsoleLogger implements ILoggable {
  log(message: string): void {
    console.log(\`CONSOLE: \${message}\`);
  }
}

// A class for logging to a fake web service
class WebServiceLogger implements ILoggable {
  log(message: string): void {
    // In a real app, this would send a network request
    console.log(\`SENT TO SERVICE: \${message}\`);
  }
}

// A class that *incorrectly* implements the interface
class BadLogger implements ILoggable {
  // ERROR: Property 'log' is missing in type 'BadLogger'
  // but required in type 'ILoggable'.
  logMessage(message: string): void { // Method name is wrong
    console.log(message);
  }
}

// 3. Use the classes
// Because both classes implement ILoggable, we can treat them interchangeably.
const loggers: ILoggable[] = [new ConsoleLogger(), new WebServiceLogger()];

loggers.forEach(logger => {
  logger.log("This is a test message.");
});
\`\`\`

---

#### Key Points

*   **Enforces a Contract:** The \`implements\` keyword is a check that the class provides the required structure. It doesn't change the class's type or implement the methods for you.
*   **Public Side Only:** Interfaces only describe and check the public members of a class, not its private or protected members.
*   **Multiple Interfaces:** A class can implement multiple interfaces, allowing it to adhere to several different contracts at once.

\`\`\`typescript
class MyComponent implements IClickable, IDraggable {
  // ... must implement methods from both interfaces
}
\`\`\``,
    ['typescript', 'interfaces', 'implements', 'oop', 'contracts'],
    'intermediate'
  ),
]);

import { category, topic } from '../../utils/topicHelpers';

export const configuration = category('Configuration & Practical Usage', [
  topic(
    'tsconfig.json',
    `### tsconfig.json

The \`tsconfig.json\` file is the control center for your TypeScript project. It specifies the root files and the compiler options required to compile the project. This file allows you to configure how the TypeScript compiler (\`tsc\`) behaves, ensuring consistency across your team and development environment.

You can generate a default \`tsconfig.json\` file by running \`tsc --init\` in your project's root directory.

---

#### Key Compiler Options

Inside the \`compilerOptions\` object, you define how your code should be checked and transpiled.

| Option | Description | Example Value |
| :--- | :--- | :--- |
| \`target\` | Specifies the ECMAScript target version for the output JavaScript. | \`"ES2022"\` |
| \`module\` | Specifies the module code generation standard (e.g., CommonJS for Node.js, ESNext for modern browsers). | \`"NodeNext"\` |
| \`strict\` | Enables all strict type-checking options, which is highly recommended for catching errors early. | \`true\` |
| \`esModuleInterop\` | Improves compatibility between CommonJS and ES modules. | \`true\` |
| \`outDir\` | The output directory for compiled JavaScript files. | \`"./dist"\` |
| \`rootDir\` | Specifies the root directory of your input TypeScript files. | \`"./src"\` |
| \`skipLibCheck\` | Skips type checking of all declaration files (\`.d.ts\`), which can speed up compilation. | \`true\` |

---

#### Example tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
\`\`\`

This configuration tells the compiler to:

*   Compile all files in the \`src\` directory.
*   Output modern ES2022 JavaScript using Node.js module resolution.
*   Enforce strict type-checking.
*   Place the compiled \`.js\` files in a \`dist\` folder.`,
    ['typescript', 'tsconfig', 'configuration', 'compiler'],
    'beginner'
  ),

  topic(
    'Modules: import and export',
    `### Modules: import and export

TypeScript, just like modern JavaScript, uses ES Modules (ESM) as its primary way to organize code. Any file containing a top-level \`import\` or \`export\` is considered a module. Variables, functions, and classes inside a module are private to that module unless you explicitly export them.

---

#### 1. Named Exports

You can export multiple items from a single file by adding the \`export\` keyword before their declaration.

**\`math.ts\`**

\`\`\`typescript
export const PI = 3.14;

export function add(a: number, b: number): number {
  return a + b;
}
\`\`\`

To use these, you import them using their exact names inside curly braces \`{}\`.

**\`app.ts\`**

\`\`\`typescript
import { add, PI } from "./math";

console.log(add(2, 3)); // 5
console.log(PI);       // 3.14
\`\`\`

You can also rename imports using the \`as\` keyword.

\`\`\`typescript
import { add as sum } from "./math";
console.log(sum(5, 10)); // 15
\`\`\`

---

#### 2. Default Exports

A file can have only one default export. This is useful for modules that export a single primary class or function.

**\`logger.ts\`**

\`\`\`typescript
export default function log(message: string): void {
  console.log(message);
}
\`\`\`

You can import a default export with any name you choose, without needing curly braces.

**\`app.ts\`**

\`\`\`typescript
import myCustomLogger from "./logger";

myCustomLogger("Hello, world!");
\`\`\`

---

#### 3. Type-Only Imports and Exports

If you only need to import a type or interface, you can use the \`type\` keyword. This makes it clear that the import has no runtime cost and will be erased during compilation.

**\`types.ts\`**

\`\`\`typescript
export type User = {
  name: string;
  id: number;
};
\`\`\`

**\`app.ts\`**

\`\`\`typescript
import type { User } from "./types";

const alice: User = { name: "Alice", id: 1 };
\`\`\`

---

#### How tsconfig.json Affects Modules

The \`"module"\` option in your \`tsconfig.json\` tells TypeScript what module system the final JavaScript code should use.

*   **\`"ESNext"\`**: Outputs modern \`import\`/\`export\` syntax. Use this for browsers or modern Node.js.
*   **\`"NodeNext"\` or \`"CommonJS"\`**: Transpiles to \`require()\` and \`module.exports\`, the module system traditionally used in Node.js.`,
    ['typescript', 'modules', 'import', 'export'],
    'intermediate'
  ),

  topic(
    'Declaration Files (.d.ts)',
    `### Declaration Files (.d.ts)

Many popular JavaScript libraries were not written in TypeScript. By default, when you try to use them in a TypeScript project, the compiler doesn't know what types their functions and variables have, so it treats them as \`any\`.

Declaration files solve this problem. They are special files (ending in \`.d.ts\`) that contain only type information and no implementation (no code). Their sole purpose is to describe the "shape" of existing JavaScript code to the TypeScript compiler.

---

#### What They Do:

*   Provide type definitions for JavaScript libraries.
*   Enable autocompletion and type-checking for plain JavaScript code.
*   Act as a bridge between the TypeScript and JavaScript worlds.

---

#### How to Get Declaration Files

There are two primary sources for declaration files:

1.  **Bundled with the Library:** Many modern JavaScript libraries are either written in TypeScript or ship with their own hand-written \`.d.ts\` files. When you install such a package, you get the types automatically.

2.  **DefinitelyTyped (\`@types\`):** This is a massive, community-driven repository of declaration files for thousands of JavaScript libraries. If a library doesn't include its own types, you can almost always find them here. You install them from npm under the \`@types\` scope.

---

#### Example: Using a JavaScript Library (Lodash)

Let's say you want to use the popular JavaScript utility library \`lodash\`.

**1. Install the library and its types:**

\`\`\`bash
npm install lodash
npm install @types/lodash --save-dev
\`\`\`

**2. Use it in your TypeScript code:**

\`\`\`typescript
import _ from 'lodash';

const numbers = [1, 2, 3, 4];

// TypeScript knows \`_.shuffle\` exists, takes an array,
// and returns an array of the same type.
const shuffled = _.shuffle(numbers);

console.log(shuffled); // e.g., [3, 1, 4, 2]

// TypeScript will give you an error if you use it incorrectly,
// thanks to the @types/lodash declaration file.
// ERROR: Argument of type 'string' is not assignable to parameter of type 'any[]'.
// _.shuffle("hello");
\`\`\`

Without \`@types/lodash\`, TypeScript would complain that it can't find the module \`lodash\` or would treat \`_\` as type \`any\`, removing all safety and autocompletion.`,
    ['typescript', 'declaration-files', 'd-ts', 'types', 'definitely-typed'],
    'intermediate'
  ),
]);

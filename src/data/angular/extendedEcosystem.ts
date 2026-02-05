import { category, topic } from '../../utils/topicHelpers';

export const extendedEcosystem = category('Extended Ecosystem', [
  topic(
    'Service Workers (PWA)',
    `Angular makes turning an application into a **Progressive Web App (PWA)** nearly automatic. By using the \`@angular/pwa\` package, you add a Service Worker that runs in the browser background, managing asset caching, offline support, and push notifications.

> In modern Angular, this is integrated via the **Angular Service Worker (NGSW)**, which is configuration-driven rather than requiring you to write manual, low-level Service Worker scripts.

---

### 1. Installation & Setup

To add PWA support to an existing project, the CLI does the heavy lifting:

\`\`\`bash
ng add @angular/pwa
\`\`\`

**What this command does:**
- Adds the \`@angular/service-worker\` package
- Creates a \`manifest.webmanifest\` file (for "Add to Home Screen")
- Creates \`ngsw-config.json\` (the caching strategy configuration)
- Updates \`main.ts\` to register the service worker

---

### 2. Configuration (ngsw-config.json)

Instead of writing \`fetch\` event listeners, you define your caching strategy in JSON.

| Group Type | Description |
|------------|-------------|
| **Asset Groups** | For static assets (CSS, JS, Images). \`installMode: prefetch\` downloads everything while the app is loading. \`installMode: lazy\` downloads only when requested |
| **Data Groups** | For API calls (Dynamic data). \`freshness\` focuses on getting the latest data (Network-first). \`performance\` focuses on speed (Cache-first) |

\`\`\`json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": { "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"] }
    }
  ],
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": ["/api/v1/posts"],
      "cacheConfig": { "strategy": "performance", "maxSize": 10, "maxAge": "1d" }
    }
  ]
}
\`\`\`

---

### 3. Registering in Standalone Apps

In Angular v20, you provide the service worker in your \`app.config.ts\` or \`main.ts\` using the provider pattern.

\`\`\`typescript
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Only enable in production
      registrationStrategy: 'registerWhenStable:30000' // Wait for app to be stable
    })
  ]
};
\`\`\`

---

### 4. Handling Updates (SwUpdate)

Since PWAs cache the site, users might be stuck on an old version. Angular provides the \`SwUpdate\` service to detect and force updates.

\`\`\`typescript
import { SwUpdate } from '@angular/service-worker';

@Component({...})
export class AppComponent {
  constructor(swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      swUpdate.versionUpdates.subscribe(evt => {
        if (evt.type === 'VERSION_READY') {
          if (confirm('New version available. Load now?')) {
            window.location.reload();
          }
        }
      });
    }
  }
}
\`\`\`

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Usually relies on Workbox (via \`workbox-webpack-plugin\` or Vite PWA plugin). You often have to write a custom service worker file or use templates that generate one |
| **Angular** | The service worker is an "official" part of the framework. It's highly opinionated and configuration-based. You rarely write the actual \`.js\` worker code; you just edit the \`.json\` config |

---

### 6. Debugging Tip

Service workers only work in **Production builds**. To test your PWA locally:

1. Run \`ng build\`
2. Use a static server like \`http-server\` inside the \`dist/\` folder
3. Open Chrome DevTools -> Application -> Service Workers`,
    ['service-worker', 'PWA', 'caching'],
    'advanced'
  ),
  topic(
    'Web Workers',
    `Web Workers allow you to run heavy computational tasks in a **background thread**, separate from the browser's main UI thread. This ensures that complex logic (like image processing, large data parsing, or heavy calculations) doesn't "freeze" the user interface.

> In Angular, the CLI provides first-class support for Web Workers, automatically handling the complex bundling and code-splitting required to make them work.

---

### 1. Generating a Worker

The Angular CLI has a dedicated schematic to set up the worker and the boilerplate code needed to communicate with it.

\`\`\`bash
ng generate web-worker app
\`\`\`

**This command does three things:**
- Creates \`app.worker.ts\`
- Configures \`tsconfig.worker.json\`
- Adds the worker logic to your \`app.component.ts\`

---

### 2. The Worker Script (app.worker.ts)

The worker lives in its own global context. It **cannot access the DOM**, the \`window\` object, or Angular services. It communicates purely via messages.

\`\`\`typescript
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  // Heavy computation here
  const result = performHeavyCalc(data);

  // Send result back to main thread
  postMessage(result);
});

function performHeavyCalc(input: any) {
  return \`Processed: \${input}\`;
}
\`\`\`

---

### 3. Using the Worker in a Component

In modern Angular, you initialize the worker using a standard URL constructor. The Angular builder (Esbuild/Vite) recognizes this syntax and bundles the worker separately.

\`\`\`typescript
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  template: \`<p>Check console for worker results</p>\`
})
export class AppComponent implements OnInit {
  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      // Create a new web worker
      const worker = new Worker(new URL('./app.worker', import.meta.url));

      // Listen for messages from the worker
      worker.onmessage = ({ data }) => {
        console.log('Page got message:', data);
      };

      // Send data to the worker
      worker.postMessage('hello world');
    } else {
      // Fallback for environments where Web Workers are not supported
      console.warn('Web Workers are not supported in this environment.');
    }
  }
}
\`\`\`

---

### 4. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Does not have a built-in CLI command for Web Workers. You usually have to manually configure Webpack (\`worker-loader\`) or Vite (using \`?worker\` imports) and handle the TypeScript configuration yourself |
| **Angular** | The integration is schematic-driven. The \`ng generate\` command handles the tsconfig and the specialized build-step configuration automatically |

---

### 5. When to use Web Workers in Angular

| Use Case | Description |
|----------|-------------|
| **Data Transformation** | Processing massive JSON responses from an API |
| **Image/Video Processing** | Filtering or generating thumbnails in the browser |
| **Encryption** | Generating keys or hashing large files |

> **Note:** Do not use them for simple HTTP calls. The \`HttpClient\` already handles async operations efficiently without blocking the UI.

---

### 6. Limitations

| Limitation | Description |
|------------|-------------|
| **No DOM Access** | You cannot manipulate HTML elements inside a worker |
| **No Angular Context** | You cannot inject Angular Services (\`@Injectable\`) into a worker |
| **Serialization Cost** | Data passed between the main thread and the worker is cloned, not shared. Passing massive objects frequently can actually slow down the app due to the "Structured Clone" overhead |`,
    ['web-worker', 'CPU', 'offloading'],
    'advanced'
  ),
  topic(
    'Builders & Workspace Config',
    `Angular is a **workspace-based framework**. Unlike a simple React setup where a \`vite.config.js\` might handle everything, Angular uses a structured configuration file (\`angular.json\`) to manage multiple projects, build targets (development, production), and the "Builders" (the underlying tools that compile and serve your code).

> In modern Angular (v17+), the default builder has shifted from **Webpack** to **Esbuild and Vite**, resulting in significantly faster build times.

---

### 1. The Anatomy of angular.json

This is the "brain" of your workspace. The most important section is the \`architect\` node, which defines how to build, serve, and test your app.

\`\`\`json
{
  "projects": {
    "my-app": {
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"]
          },
          "configurations": {
            "production": { "optimization": true, "outputHashing": "all" },
            "development": { "optimization": false }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": { "production": { "buildTarget": "my-app:build:production" } }
        }
      }
    }
  }
}
\`\`\`

---

### 2. The Modern "Application" Builder

Prior to v17, Angular used separate builders for the browser and SSR. The new \`@angular-devkit/build-angular:application\` builder unifies this.

| Mode | Description |
|------|-------------|
| **Development** | Uses Vite as the dev server for near-instant cold starts |
| **Production** | Uses Esbuild to bundle and minify code up to 80% faster than Webpack |
| **SSR** | Build-time Prerendering and Server-Side Rendering are now handled natively within this single builder |

---

### 3. Build Targets & ng Commands

The CLI commands map directly to the architect targets in \`angular.json\`:

| Command | Target |
|---------|--------|
| \`ng build\` | Executes \`architect/build\` |
| \`ng serve\` | Executes \`architect/serve\` (which references a build target) |
| \`ng test\` | Executes \`architect/test\` |

You can trigger specific configurations using the \`--configuration\` flag:

\`\`\`bash
ng build --configuration development
\`\`\`

---

### 4. Custom Builders

If you need to perform custom logic during the build (e.g., uploading files to S3 after a build), you can write your own builder. A builder is just a function that returns an Observable.

\`\`\`typescript
import { createBuilder } from '@angular-devkit/architect';

export default createBuilder((options, context) => {
  context.logger.info('Starting custom build step...');
  return { success: true };
});
\`\`\`

---

### 5. Workspace vs. Project

| Concept | Description |
|---------|-------------|
| **Workspace** | The root folder containing \`angular.json\` and \`package.json\` |
| **Project** | A workspace can contain multiple "projects" (applications or libraries). Apps go in \`src/\` (or \`projects/\`). Libraries go in \`projects/\` and can be shared across multiple apps in the same workspace |

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Usually configuration-light (Vite/Next.js). If you need complex multi-app setups, you typically reach for third-party tools like Nx or Turborepo |
| **Angular** | Multi-project support is built-in. The CLI handles the dependency graph between your internal libraries and applications via \`angular.json\` without any extra tools |

---

### 7. Performance Tip: budgets

Angular allows you to set "budgets" in \`angular.json\`. If your main JS bundle exceeds a certain size (e.g., 500kb), the build will throw a warning or error. This is a "fail-safe" for performance.

\`\`\`json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kb",
    "maximumError": "1mb"
  }
]
\`\`\``,
    ['angular.json', 'builders', 'workspace'],
    'intermediate'
  ),
]);

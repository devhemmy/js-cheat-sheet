import { category, topic } from '../../utils/topicHelpers';

export const ssrPerformance = category('SSR & Performance', [
  topic(
    'Hydration',
    `Hydration is the process that restores a server-side rendered (SSR) application on the client. In older versions of Angular, this was "destructive": the browser would receive the HTML, then Angular would wipe the entire DOM and re-render everything from scratch, causing a visible "flicker."

Modern Angular (v17+) uses **Non-Destructive Hydration**. Instead of destroying the DOM, Angular traverses the existing HTML, attaches event listeners, and binds the internal data structures to the existing nodes.

---

### 1. How to Enable it

Hydration is now a standard part of the Angular SSR story. You enable it in your \`app.config.ts\` by adding a provider.

\`\`\`typescript
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration() // This enables the non-destructive process
  ]
};
\`\`\`

---

### 2. Benefits

| Benefit | Description |
|---------|-------------|
| **No Flickering** | Since the DOM isn't replaced, the UI remains stable as the JavaScript loads |
| **Better Web Vitals** | Improves LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) |
| **Preserved State** | Form inputs and scroll positions are much easier to maintain during the transition from "static HTML" to "interactive App" |

---

### 3. Common Pitfalls: DOM Mismatch

Hydration requires the DOM generated on the server to be **identical** to what the client expects. If they differ, hydration will fail (or "de-hydrate" and fall back to destructive rendering).

**Common Causes of Mismatches:**

| Cause | Description |
|-------|-------------|
| **Direct DOM Manipulation** | Using \`document.querySelector\` or \`innerHTML\` in a component. Angular cannot "track" these changes |
| **Browser-only Globals** | Using \`window\` or \`localStorage\` during the initial render. Since these don't exist on the server (Node.js), the server renders one thing, and the client tries to render another |
| **Invalid HTML** | Browser-corrected HTML (e.g., putting a \`<div>\` inside a \`<p>\`) will confuse the hydration crawler |

---

### 4. Handling Browser-Specific Code

To prevent hydration errors when using browser APIs, you should wrap that code in a check or use the \`afterNextRender\` lifecycle hook.

\`\`\`typescript
import { afterNextRender } from '@angular/core';

export class MyComponent {
  constructor() {
    afterNextRender(() => {
      // Safe to use window/localStorage here
      console.log(window.location.href);
    });
  }
}
\`\`\`

---

### 5. Skipping Hydration

If you have a specific component (like a heavy third-party D3 chart) that simply cannot work with hydration, you can tell Angular to skip it using the \`ngSkipHydration\` attribute.

\`\`\`html
<my-messy-chart ngSkipHydration />
\`\`\`

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | React has had hydration for a long time. However, React's "Streaming SSR" allows it to hydrate parts of the page as they arrive |
| **Angular** | Angular's hydration is currently a "whole-app" or "per-route" transition. However, Angular's unique advantage is how it integrates with Signals—in the future, Angular aims for "Partial Hydration" where only the parts of the page that actually change (tracked by Signals) get hydrated, potentially making Angular apps much faster than traditional React apps |`,
    ['incremental', 'partial', 'hydration', 'SSR'],
    'advanced'
  ),
  topic(
    'Event Replay',
    `Event Replay is a performance feature (introduced in Angular v18) that solves the **"Dead Zone" problem** in SSR applications. It captures user events (like clicks or keystrokes) that happen after the page is visible but before the JavaScript has finished loading and hydrating. Once hydration is complete, Angular "replays" those events so the user's actions aren't lost.

---

### 1. The Problem: The "Dead Zone"

In traditional SSR:

1. Server sends HTML
2. User sees the button and clicks it
3. **Nothing happens** because the JavaScript (Angular) hasn't finished downloading/executing yet
4. The user thinks the site is broken and leaves

---

### 2. The Solution: How it Works

Angular injects a tiny, inline script at the top of the HTML. This script adds global event listeners to the \`window\`. When a user clicks a button during the "Dead Zone," the script records:

- The event type (e.g., \`click\`)
- The target element
- The event data

As soon as Angular hydrates, it checks this "buffer," finds the corresponding component logic, and triggers the function as if the click just happened.

---

### 3. Enabling Event Replay

This feature is built into the hydration system. You enable it within the \`provideClientHydration\` function using \`withEventReplay()\`.

\`\`\`typescript
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay() // Enables the recording and replaying of events
    )
  ]
};
\`\`\`

---

### 4. Why this matters for UX

Without Event Replay, developers often had to show "Loading" states or hide buttons until hydration was finished to avoid frustrating users. With Event Replay, the app feels interactive much sooner, even if the heavy logic is still downloading in the background.

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | React doesn't have a native "Event Replay" built directly into the core library in the same way. Libraries like Google's \`js-action\` were often used to achieve this. React's strategy focuses more on Selective Hydration (hydrating the part of the screen the user is interacting with first) |
| **Angular** | Event Replay is a first-party, "flip-a-switch" feature. It ensures that no matter where the user clicks on the page, the action is queued and executed as soon as the framework is ready |`,
    ['event-replay', 'SSR', 'performance'],
    'advanced'
  ),
  topic(
    'Image Optimization',
    `The \`NgOptimizedImage\` directive (used via the \`ngSrc\` attribute) is Angular's built-in solution for high-performance image loading. It enforces best practices that are often easy to forget, such as preventing Layout Shift (CLS), prioritizing the "Above the Fold" content, and automatically generating responsive images.

---

### 1. Basic Usage

To use it, you import the \`NgOptimizedImage\` directive into your standalone component and replace the standard \`src\` attribute with \`ngSrc\`.

\`\`\`typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgOptimizedImage],
  template: \`
    <!-- Standard Image -->
    <img ngSrc="assets/hero.jpg" width="800" height="600" priority>
  \`
})
\`\`\`

---

### 2. The Core Performance Rules

The directive enforces three main things that significantly impact your Core Web Vitals:

#### A. Forced Aspect Ratio (Prevents CLS)

You **must** provide a \`width\` and \`height\`. This allows the browser to reserve the correct amount of space for the image before it even downloads, preventing the page content from "jumping" when the image finally appears.

#### B. Priority Loading (LCP)

For images that are visible immediately (like a Hero image), you add the \`priority\` attribute.

| Attribute | Behavior |
|-----------|----------|
| **Without \`priority\`** | Images are lazy-loaded by default to save bandwidth |
| **With \`priority\`** | The directive sets \`fetchpriority="high"\` and ensures it isn't lazy-loaded, helping your Largest Contentful Paint (LCP) score |

#### C. Intelligent Lazy Loading

Any image without the \`priority\` attribute is automatically set to \`loading="lazy"\`. You don't have to remember to add it manually.

---

### 3. Image Loaders (CDN Integration)

Angular makes it easy to connect to Image CDNs (like Cloudinary, Imgix, or Akamai). Instead of writing long, complex URLs for every image, you define a Loader.

\`\`\`typescript
import { provideCloudinaryLoader } from '@angular/common';

// In app.config.ts
providers: [
  provideCloudinaryLoader('https://res.cloudinary.com/my-account')
]

// In Template
// This will automatically resolve to the full Cloudinary URL
<img ngSrc="profile-pic.jpg" width="50" height="50">
\`\`\`

---

### 4. Automatic srcset

When using a CDN loader, Angular can automatically generate a \`srcset\` for you. This means if a user is on a small mobile device, Angular will instruct the CDN to resize the image and serve a smaller version, saving data.

---

### 5. Warnings and Hints

One of the best "under the hood" features is that in **Development Mode**, the directive will log warnings to the console if:

- The image is too large for its container (wasting bytes)
- An image is marked \`priority\` but it's not actually visible on initial load
- The aspect ratio of the \`width\`/\`height\` attributes doesn't match the actual image file

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React (Standard)** | You typically just use the standard \`<img>\` tag or third-party libraries. You have to manually handle \`loading="lazy"\`, \`fetchpriority\`, and aspect ratio |
| **Next.js (next/image)** | This is the closest comparison. Both provide automatic resizing and optimization. However, Angular's version is runtime-checked in the browser console during development, giving you active feedback on how to fix performance issues, whereas Next.js handles most of its magic during the build/server-render phase |`,
    ['NgOptimizedImage', 'images', 'performance'],
    'intermediate'
  ),
]);

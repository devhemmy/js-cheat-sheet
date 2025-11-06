# 🚀 JavaScript & TypeScript Interview Cheat Sheet

A modern, production-ready web application designed to help developers ace their technical interviews with comprehensive coverage of JavaScript, TypeScript, and React concepts.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)

## ✨ Features

- **📚 Comprehensive Coverage**: 16+ JavaScript topics and 13+ TypeScript topics
- **🎨 Modern UI/UX**: Beautiful gradient designs with glassmorphism effects
- **📱 Fully Responsive**: Mobile-first design with hamburger menu
- **⚡ Optimized Performance**:
  - Lazy loading and code splitting
  - Suspense boundaries for smooth loading
  - Production-ready build configuration
- **🛡️ Error Handling**: Custom error boundaries with graceful fallbacks
- **♿ Accessible**: ARIA labels, semantic HTML, and keyboard navigation
- **🔍 SEO Optimized**: Complete meta tags and Open Graph support
- **💅 Tailwind CSS**: Utility-first styling with custom animations
- **📝 Syntax Highlighting**: Beautiful code examples with Prism
- **🎯 Type Safety**: Full TypeScript implementation with strict mode

## 📦 Topics Covered

### JavaScript
- **Core Fundamentals**: var/let/const, this keyword, data types, equality, type coercion
- **Scope & Functions**: closures, arrow vs regular functions
- **Async JavaScript**: event loop, promises, async/await
- **OOP**: prototypal inheritance, constructors, ES6 classes
- **Modern ES6+**: destructuring, spread/rest, modules, array methods

### TypeScript
- **Fundamentals**: core types, annotations, interfaces vs types
- **Advanced Types**: unions, intersections, generics, enums, type guards, utility types
- **OOP**: classes, implementing interfaces
- **Configuration**: tsconfig, modules, declaration files

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd js-cheat-sheet

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Navigation with mobile menu
│   ├── Hero.tsx             # Landing page hero section
│   ├── Footer.tsx           # Footer component
│   ├── JavaScriptPage.tsx   # Main content page layout
│   ├── TableOfContents.tsx  # Sidebar navigation
│   ├── Content.tsx          # Markdown content renderer
│   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   ├── LoadingSpinner.tsx   # Loading state component
│   └── Markdown.css         # Markdown styling
├── types/
│   └── index.ts             # TypeScript type definitions
├── javascriptData.ts        # JavaScript topics data
├── typescriptData.ts        # TypeScript topics data
├── App.tsx                  # Main app with routing
├── main.tsx                 # App entry point
└── index.css                # Global styles & animations
```

## 🛠️ Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16
- **Routing**: React Router DOM 7.9.5
- **Markdown**: react-markdown with remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter (Prism)
- **Linting**: ESLint with TypeScript support

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect on cards
- **Gradient Backgrounds**: Beautiful purple-violet color scheme
- **Smooth Animations**: Fade-in effects and hover transitions
- **Custom Scrollbars**: Themed scrollbars matching the design
- **Responsive Typography**: Scales beautifully across devices

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### TypeScript
The project uses strict TypeScript configuration with:
- Strict mode enabled
- ES2020 target
- ESNext modules
- React JSX

### Vite
Optimized for production with:
- Tree shaking
- Code splitting
- Asset optimization
- Fast HMR in development

## 🚀 Performance Optimizations

1. **Lazy Loading**: Routes are lazy-loaded for better initial load time
2. **Code Splitting**: Automatic code splitting with Vite
3. **Memoization**: Prevents unnecessary re-renders
4. **Optimized Images**: SVG icons and optimized assets
5. **Tree Shaking**: Removes unused code in production

## 🔒 Error Handling

- Custom error boundaries catch and display errors gracefully
- 404 page for undefined routes
- TypeScript strict mode prevents runtime errors
- Fallback UI for Suspense boundaries

## 📈 Future Enhancements

- [ ] Add React topics and examples
- [ ] Search functionality across all topics
- [ ] Dark/Light theme toggle
- [ ] Bookmark favorite topics
- [ ] Print-friendly version
- [ ] Progressive Web App (PWA) support
- [ ] Code playground for live examples

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Icons from Heroicons
- Syntax highlighting by Prism

---

**Made with ❤️ for interview preparation**

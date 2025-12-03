# the gyat

A modern, interactive gym app built with React, TypeScript, and Vite. This project features an interactive gym map with equipment tracking etc.

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- Node.js includes npm (Node Package Manager) which we'll use to install dependencies
- **Git** (optional, for version control) - [Download here](https://git-scm.com/)

To check if Node.js is installed, open your terminal/command prompt and run:
```bash
node --version
npm --version
```

(My current versions are Node.js v22.11.0 and npm v10.9.2, so if it doesn't work for you that's your fault)

## Installation

Follow these steps to set up the project on your local machine:

### 1. Clone or Download the Project

If using Git:
```bash
git clone https://gitlab.bath.ac.uk/nw714/group-2-swe.git
cd group-2-swe
```

Or download the ZIP file and extract it to wherever you please.

### 2. Install Dependencies

Open your terminal in the project folder and run the **big** command:

```bash
npm install
```

This command will install all the required packages listed in `package.json`, including:
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Adds type safety to JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics library
- **Framer Motion** - Animation library
- **GSAP** - Professional animation library
- **React Router** - Navigation between pages
- And whatevers left...

This process will probably take a few minutes depending on your internet connection.
### 3. Set Up Environment Variables

If the project requires environment variables (for example, API keys or configuration settings), create a `.env` file in the root directory.
If you need help, ask nathan, but I'm probably not going to know myself. (But currently there are no env variables needed)

## Running the Application

### Development Mode

To start the development server with hot-reload:

```bash
npm run dev
```

This will start the application at `http://localhost:5173` (or another port if 5173 is busy). The page will automatically reload when you make changes to the code.
(Hot-reloading is the best thing since sliced bread (I actually don't even like bread that much icl), thanks to Vite)

### Building for Production

To create an optimised production build (You probably won't ever need this until deployment):

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

To preview the production build locally (again probably not needed):

```bash
npm run preview
```

### Type Checking

To check for TypeScript errors without running the app:

```bash
npm run typecheck
```

### Linting

To check code quality and find potential errors:

```bash
npm run lint
```

## Project Structure

Current project structure (as of 3/12/2025, but I probably won't update this regularly because I cba):

```
project-root/
├── src/                      # Source code
│   ├── backgrounds/          # Background visual effects components
│   ├── components/           # Reusable UI components
│   │   └── effects/          # Special effect components
│   ├── constants/            # Constant values (colors, configs)
│   ├── context/              # React context providers
│   ├── pages/                # Page components
│   ├── styles/               # Global styles and SCSS files
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global CSS with Tailwind
├── public/                   # Static assets
├── .env                      # Environment variables (not in Git)
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## Key Technologies

### React
- **What it is**: A JavaScript library for building user interfaces
- **Why we use it**: Creates reusable components and manages application state efficiently
- **File extension**: `.tsx` (TypeScript + JSX)

### TypeScript
- **What it is**: JavaScript with type checking
- **Why we use it**: Catches errors before runtime and provides better code completion
- **Key concepts**: Types, interfaces, type annotations

### Vite
- **What it is**: Modern build tool and development server
- **Why we use it**: Very fast hot-reload and optimised builds
- **Configuration**: `vite.config.ts`

### Tailwind CSS
- **What it is**: Utility-first CSS framework
- **Why we use it**: Rapid UI development with pre-defined utility classes
- **Usage**: Add classes like `bg-blue-500`, `p-4`, `flex`, etc. directly in JSX
- **Configuration**: `tailwind.config.js`

### React Router
- **What it is**: Navigation library for React
- **Why we use it**: Handles page navigation and URL routing
- **Usage**: See `App.tsx` for route definitions

## Available Pages

- **Home** (`/`) - Landing page with animated text and background effects
- **Map** (`/map`) - Interactive gym equipment map
- **Settings** (`/settings`) - Application settings (to be implemented)
- **404 Page** (`*`) - Shows when a route doesn't exist

## Common Issues & Solutions

### Port Already in Use

If you see an error that port 5173 is already in use:
- Close other instances of the development server
- Or use a different port: `npm run dev -- --port 3000`

### Module Not Found Errors

If you see "Module not found" errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### TypeScript Errors

If you see TypeScript errors:
- Run `npm run typecheck` to see all type errors
- Make sure all imported modules have proper type definitions
- Check that you're using correct types for props and state

### Styling Not Working

If Tailwind CSS classes aren't working:
1. Make sure your file is listed in `tailwind.config.js` content array
2. Restart the development server
3. Check browser console for errors

## Getting Help

- Check the documentation files in the `docs/` folder for detailed explanations
- Ask nathan or chatgptl (or your choice of llm) lmao
- Search for error messages online or again ask chatgpt
- Use TypeScript error messages - they usually tell you exactly what's wrong

## Next Steps

After installation, I recommend:

1. Read the documentation files:
   - `TYPES.md` - Understanding TypeScript types used in the project
   - `COMPONENTS.md` - Guide to all reusable components
   - `PAGES.md` - Understanding page structure and routing

2. Explore the code:
   - Start with `src/main.tsx` to see how the app initializes
   - Look at `src/App.tsx` to understand routing
   - Explore `src/pages/Home.tsx` for a simple page example

3. Make a small change:
   - Try changing text on the home page
   - Modify colors in `src/index.css`
   - Add a console.log to see how data flows

## Contributing

Before making changes:
1. Create a new branch for your feature (I BEG DO NOT PUSH DIRECTLY TO MAIN)
2. Make your changes
3. Test thoroughly in development mode
4. Run `npm run typecheck` and `npm run lint` (or don't, I don't care, and I never use it myself)
5. Create a pull request for review

## Resources for Learning

### JavaScript & TypeScript
- [JavaScript.info](https://javascript.info/) - Comprehensive JavaScript tutorial
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) - Official TypeScript guide

### React
- [React Official Tutorial](https://react.dev/learn) - Best place to start
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) - React with TypeScript patterns

### Tailwind CSS
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Complete utility class reference
- [Tailwind Play](https://play.tailwindcss.com/) - Online playground to experiment

### Vite
- [Vite Guide](https://vitejs.dev/guide/) - Official Vite documentation


## Contact

don't contact me, I'm probably busy.

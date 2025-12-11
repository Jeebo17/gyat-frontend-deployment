# the gyat

This is the frontend for our Gym application. It is built using **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

Follow these instructions exactly to get the project running on your device.

## Important: Before You Start

If you are working from home, **you must be connected to the University VPN** to communicate with the GitLab repository. **Setup Guide:** [https://www.bath.ac.uk/guides/setting-up-vpn-on-your-device/](https://www.bath.ac.uk/guides/setting-up-vpn-on-your-device/)

You need a **University GitLab Personal Access Token** to download this code.
1. Go to [https://gitlab.bath.ac.uk/-/user_settings/personal_access_tokens](https://gitlab.bath.ac.uk/-/user_settings/personal_access_tokens)
2. Log in with your university details.
3. Click "Add New Token".
    - **Name:** `Frontend-Access`
    - **Scopes:** Check `read_repository` and `write_repository`.
4. Click **Create Personal Access Token**.
5. **Copy the token code immediately.** Save it somewhere (e.g. in a .txt file).

---

## 1. Install Prerequisites

You need the following software installed on your computer:

1. **Node.js** (version 16 or higher)
   * Download here: [https://nodejs.org/](https://nodejs.org/)
   * Node.js includes npm (Node Package Manager) which we'll use to install dependencies

2.  **Git** (Required to download the code)
    * Download here: [https://git-scm.com/downloads](https://git-scm.com/downloads)
    * Run the installer and keep the default settings (just keep clicking "Next").

3. A code editor of your choice
   * [Visual Studio Code](https://code.visualstudio.com/)
   * From now on, I will assume you are using VS Code.

---

## 2. Installation

1. Open up **VS Code**.
2. Open up the Explorer menu on the left and click "Open Folder".
3. Choose a location on your computer where you want to store the project (e.g., Desktop or Documents) and create a new folder called `gym-frontend`. Select this folder and click "Select Folder".
4. Open the terminal in VS Code by going to the menu at the top and selecting `Terminal` > `New Terminal`.
5. Check that you have **Node.js** installed by opening a new terminal in VS Code (`Ctrl + `) and running:
   ```bash
   node --version
   npm --version
   ```
   If you see version numbers, you're good to go. If not, install Node.js from the link above.
* (My current versions are Node.js v22.11.0 and npm v10.9.2, so if it doesn't work for you that's your fault)
6. Using the terminal, clone the repository by running:
   ```bash
   git clone https://gitlab.bath.ac.uk/nw714/group-2-swe.git .
   ```
7. **Authentication:**
    * It will ask for a username and password.
    * **Username:** Your university username (e.g., `nw714`).
    * **Password:** The **Personal Access Token** you copied in the "Before You Start" section.

---

## 3. Install Dependencies
With the terminal still open, run the **big** command:
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

---

## 4. Running the Application

To start the development server with hot-reload:

```bash
npm run dev
```

This will start the application at `http://localhost:5173` (or another port if 5173 is busy). The page will automatically reload when you make changes to the code.
(Hot-reloading is the best thing since sliced bread (I actually don't even like bread that much icl), thanks to Vite)

---

## 5. Contributing

⚠️ **CRITICAL RULE:** Never push code directly to the `main` branch. Always use a separate branch for your changes.

### Step 1: Create a New Branch
Before you write a single line of code:
1.  In VS Code, open the Source Control panel by clicking the branch icon on the left sidebar.
2.  At the top, to the right of "Changes", click the 3 dots (More Actions...) and select **Checkout to...**.
3. In the popup, select **Create new branch**.
4. Enter a name for your branch following the naming conventions below:
   * `feat/add-login-page` (for new features)
   * `fix/navbar-responsive` (for bug fixes)
   * `docs/typo-in-homepage` (for documentation)
   * `style/update-button-theme` (for styling changes)
   * `refactor/sidebar-component` (for code refactoring)
5.  Press Enter to create and switch to the new branch.
6.  Now you can make your changes in this branch.

### Step 2: Write Code & Commit
1.  Make your changes to the code.
**💡 Tip:** Commit often - whenever you finish a small feature, fix a bug, or add something significant. This makes it easier to track changes and avoid losing work.
2.  Once you're ready to save your changes, go to the Source Control panel.
3.  Enter a descriptive commit message summarising your changes.
4.  Click the **Commit** to commit your changes.
5.  Alternatvely, you can use the terminal:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

### Step 3: Pull Latest Changes (Avoid Conflicts)
Before pushing, check if your teammates updated the code while you were working.
1. Verify which branch you’re on:
   ```bash
   git branch
   ```
2. Pull the latest commits from the remote for your branch:
   ```bash
   git pull origin <your-branch-name>
   ```
   * This fetches and merges the latest changes from the remote.
   * If there are conflicts, Git will prompt you to resolve them.

### Step 4: Push to GitLab
1. After resolving any conflicts, push your branch to GitLab:
   ```bash
   git push origin <your-branch-name>
   ```

### Step 5: Merge Request (The Final Step)
1.  Go to the GitLab repository in your web browser.
2.  You should see a banner at the top: *"You pushed to feat/add-login-page just now."*
3.  Click **Create Merge Request**.
4.  Add a title and description.
5.  **Assignee:** Assign it to yourself.
6.  **Reviewer:** Select Nathan Wong or a teammate to check your code.
7.  Click **Create Merge Request**.


---

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

---

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

---


## Project Structure

Current project structure (as of 3/12/2025, but I probably won't update this regularly because I cba):

```
project-root/
├── src/                      # Source code
│   ├── backgrounds/          # Background visual effects components
│   ├── components/           # Reusable UI components
│   │   ├── __tests__/        # Unit tests for components
│   │   └── effects/          # Special effect components
│   ├── constants/            # Constant values (colors, configs)
│   ├── context/              # React context providers
│   ├── pages/                # Page components
│   ├── services/             # API and data fetching logic
│   ├── styles/               # Global styles and SCSS files
│   ├── test/                 # Test utilities and mocks
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
├── vitest.config.ts          # Vitest testing configuration
└── tailwind.config.js        # Tailwind CSS configuration
```
---

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

---

## Available Pages

- **Home** (`/`) - Landing page with animated text and background effects
- **Map** (`/map`) - Interactive gym equipment map
- **Settings** (`/settings`) - Application settings (to be implemented)
- **404 Page** (`*`) - Shows when a route doesn't exist

---

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

---

## Getting Help

- Check the documentation files in the `docs/` folder for detailed explanations
- Ask nathan or chatgptl (or your choice of llm) lmao
- Search for error messages online or again ask chatgpt
- Use TypeScript error messages - they usually tell you exactly what's wrong

---

## Contact

don't contact me, I'm probably busy.

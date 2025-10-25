# Compkit

**Compkit** is an AI-powered platform for generating, sharing, and installing custom UI component libraries — no GitHub, no npm registry, no manual setup.

Generate beautiful, themeable components with AI, publish them instantly, and let anyone install them with a single command.

---

## Features

- **AI Component Generation** — Describe what you want, AI builds it
- **Instant Publishing** — Share your component library with a unique ID
- **One-Command Install** — Install any library with `npx compkit install <id>`
- **Tailwind CSS Powered** — Fully customizable styling
- **TypeScript Support** — Type-safe components out of the box

---

## How It Works

### 1. Generate Components
Use the **Compkit Generator** to create components with AI:
```bash
# Describe your component
"A modern pricing card with gradient border, icon, title, price, and CTA button"
```
AI generates the component code, preview, and exports.

### 2. Publish Your Library
Once you're happy with your components:
- Click **"Publish Library"**
- Get a unique **library ID** (e.g. `awesome-ui-kit-a7f3`)

### 3. Install Anywhere
You can install your library instantly:
```bash
npx compkit install awesome-ui-kit-a7f3
```

This will:
- Download all components to `/src/components/ui`
- Install required dependencies
- Set up Tailwind config
- Ready to use!

---

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI components
- React Live (live preview)

**Backend:**
- Node.js + Express
- Database (PostgreSQL) for component storage

**CLI:**
- `npx compkit` — Install published libraries
- Automatically configures projects

---

## Installation

### Use the Generator (Web)
Visit [compkit.dev](https://compkit.dev) to generate and publish components.

### Install a Library (CLI)
```bash
npx compkit install <library-id>
```

Example:
```bash
npx compkit install modern-buttons-x9k2
```

---

##  Example Workflow

1. **Generate** a button component:
   ```
   Prompt: "Gradient button with icon and loading state"
   ```

2. **Publish** your library:
   ```
   Library ID: gradient-buttons-j4d8
   ```

3. **Install** in your project:
   ```bash
   npx compkit install gradient-buttons-j4d8
   ```

4. **Use** in your code:
   ```tsx
   import { GradientButton } from "@/components/ui/gradient-button"

   export default function App() {
     return <GradientButton>Click me</GradientButton>
   }
   ```

---

## Development

```bash
# Clone the repo
git clone https://github.com/oskaripessinen/compkit.git
cd compkit

# Install dependencies
npm install

# Run frontend (Vite)
npm run dev

# Run backend (Express)
cd server
npm run dev
```

---

## Roadmap
- [ ] User authentication
- [ ] AI component generation
- [ ] Component preview
- [ ] Library publishing with unique IDs
- [ ] CLI for installing libraries (`npx compkit install <id>`)
- [ ] library management





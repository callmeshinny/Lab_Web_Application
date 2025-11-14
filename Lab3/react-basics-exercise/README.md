# Lab 3 – Introduction to React

MSc. Trần Vinh Khiêm – MSIS207.Q14.CTTT  
Student: Nguyễn Lê Như Ngọc – 23521031

This Vite app walks through every lab requirement, from theory questions to the Kanban-style capstone. Below is a compact map of the exercises and where to find their implementations.

---

## Foundations (Exercises 1–2)
- Imperative vs declarative, component benefits, and Virtual DOM answers are documented in comments and reflected in how the UI is structured.
- Project bootstrapped via `npm create vite@latest react-basics-exercise -- --template react`, runs on `http://localhost:5173`.
- File roles: `index.html` hosts the root node, `src/main.jsx` mounts `<App />`, `src/App.jsx` coordinates all exercise tabs.

## Components & Props (Exercises 3–4)
- `src/UserProfile.jsx` renders the exact fragment required (heading, two paragraphs, avatar) and consumes dynamic `userData`.
- `prop-types` enforces the user shape and the optional `theme` (default `'light'`), which drives CSS variants.

## State & Interaction (Exercises 5–6)
- `src/Counter.jsx` demonstrates `useState` and includes an explanation of why toggling “Online” would belong to local state.
- `src/Login.jsx` manages `{ username, password }` in a single controlled object, updates via one handler, and logs form data on submit.

## Composition Patterns (Exercise 7)
- `src/Card.jsx` wraps any content with a title.
- `src/Accordion.jsx` lifts panel state and passes `isActive`/`onShow` into `src/Panel.jsx`, matching the “only one open at a time” requirement.

## Debugging & DevTools (Exercise 8)
- Tested with the Components tab: editing the Counter hook updates the UI immediately.
- “Highlight updates when components render” shows Counter-only re-renders on increment and Login-only re-renders while typing.

## Capstone Todo Board
- Files: `src/TodoBoard.jsx`, `TodoColumn.jsx`, `TodoForm.jsx`, `TodoItem.jsx`.
- Features: controlled add form, lifted `tasks` state, move/complete/back/delete actions, and DevTools verification of state changes.

## Commands
```bash
npm install
npm run dev   # http://localhost:5173
npm run build
```

React DevTools is used to satisfy the debugging portion of the lab.

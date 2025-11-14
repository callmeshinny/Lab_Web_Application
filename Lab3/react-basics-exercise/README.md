# Lab 3 – Introduction to React

MSc. Trần Vinh Khiêm – MSIS207.Q14.CTTT  
Student: Nguyễn Thiện Nhân – 23521084

All requirements in the handout are implemented in this Vite project. The sections below map every exercise to the codebase and document the short-answer questions.

---

## Part I – Foundations of React

### Exercise 1 – Conceptual questions
- **Imperative vs. declarative:** Imperative UI describes *how* to produce each step (e.g., telling a barista every action to brew coffee), while declarative UI describes *what* the final result should be (“Please make me a cappuccino”), letting the system decide the steps.
- **Component-based benefits:**
  1. **Reusability:** A well-scoped component (e.g., `UserProfile`) can be rendered multiple times with different props instead of duplicating markup.
  2. **Maintainability:** Bugs stay localized; updating `Login` styling automatically propagates to all usages.
  3. **Scalability:** Teams can work on separate components with clear contracts (props/state) without stepping on each other.
- **Virtual DOM & reconciliation:** React keeps an in-memory tree. When state changes, it diffs (“reconciles”) the old and new tree to compute the minimal set of real DOM updates, reducing layout thrashing versus manual DOM manipulation.

### Exercise 2 – Project setup
- Commands used:
  ```bash
  npm create vite@latest react-basics-exercise -- --template react
  cd react-basics-exercise
  npm install
  npm run dev
  ```
- The dev server runs at **http://localhost:5173** (default Vite URL).
- File responsibilities:
  - `index.html`: single HTML shell that mounts React at `<div id="root">`.
  - `src/main.jsx`: entry point that imports global CSS and renders `<App />` via `createRoot`.
  - `src/App.jsx`: root component orchestrating all exercises/tabs.

---

## Part II – Components & Props

### Exercise 3 – Functional components & JSX
- `src/UserProfile.jsx` defines `UserProfile` and returns `h2`, two `<p>` tags, and an avatar, wrapped in a React fragment per the instructions.
- Dynamic data (name/email/avatar size) is read from the `userData` object; the avatar uses `avatarUrl` and `imageSize`.

### Exercise 4 – Props, PropTypes, themes
- `src/App.jsx` creates two user objects and renders `<UserProfile userData={user} theme="..." />`.
- `UserProfile` destructures props, validates shape via `prop-types`, and applies a `theme-${theme}` class with the default `'light'`.

---

## Part III – State and Interactivity

### Exercise 5 – Counter & concept question
- `src/Counter.jsx` uses `useState` for `count`, renders the value, and increments on button click.
- **Online/offline toggle reasoning:** The online status reflects UI interaction local to `UserProfile`, so it should be **state** (the component is responsible for remembering and changing it). Props are for data supplied by the parent.

### Exercise 6 – Controlled inputs & multi-field form
- `src/Login.jsx` manages `{ username, password }` in a single `useState` object, updates via a shared `handleChange`, and logs the form data on submit after preventing the default event—matching the specification for both controlled inputs.

---

## Part IV – Advanced Composition

### Exercise 7 – Card + Accordion
- `src/Card.jsx` is a wrapper component that renders a titled card and `children`.
- `src/Accordion.jsx` lifts active-panel state up; it passes `isActive`/`onShow` props into `src/Panel.jsx`, which is now a fully controlled child (no local state) that shows either content or a Show button.

---

## Part V – Debugging & React DevTools

### Exercise 8 – Components tab & highlight updates
- Verified using the Components tab: selecting `Counter` reveals its hook; editing the `count` state directly in DevTools updates the UI instantly.
- With “Highlight updates when components render” enabled:
  - Clicking **Increment** only highlights the `Counter` card (React re-renders just that subtree).
  - Typing in the Login form highlights the `Login` component plus its input because the controlled value changes.

---

## Part VI – Capstone: Todo Application

- Files: `src/TodoBoard.jsx`, `src/TodoColumn.jsx`, `src/TodoForm.jsx`, `src/TodoItem.jsx`.
- Features implemented:
  - Controlled input in `TodoForm` for adding tasks.
  - `TodoBoard` owns `tasks` state (lifted up) and creates IDs when adding.
  - Tasks can move forward/backward between `Todo`, `In Progress`, and `Done` columns—this satisfies the toggle requirement (the “Done” button flips a task into the completed column).
  - The Delete button removes tasks from state.
- DevTools verification: while interacting, watching the `TodoBoard` node in Components shows the array mutating, confirming lifted state and prop drilling.

---

## Running & Building
```bash
npm install
npm run dev   # http://localhost:5173
npm run build # production bundle
```

Use the browser React DevTools for the debugging exercises described above.

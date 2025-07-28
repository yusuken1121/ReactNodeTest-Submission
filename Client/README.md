# Client Coding Conventions

This document outlines the coding standards and best practices for the React client application. Following these guidelines is essential for maintaining a clean and scalable codebase.

## Overall Conventions

1.  **Formatting**: Code formatting is strictly enforced by **Prettier** and **ESLint**. Do not manually adjust formatting.
2.  **Naming Convention**:
    - **Components/Files**: Use `PascalCase` (e.g., `MeetingList.js`).
    - **Variables/Functions**: Use `camelCase` (e.g., `getMeetings`).
    - **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `API_URL`).

---

## Client-Side Conventions

1.  **Directory Structure**
    - **`src/components/`**: Contains reusable UI components (e.g., `Button.js`, `Input.js`).
    - **`src/pages/`** (or `src/views/`): Contains top-level components for each page (e.g., `LoginPage.js`, `MeetingsPage.js`).
    - **`src/services/`**: Contains API communication logic (e.g., configured Axios instances).
    - **`src/hooks/`**: Contains custom React hooks (e.g., `useFetch.js`).
    - **`src/utils/`**: Contains utility functions (e.g., `formatDate.js`).
    - **`src/assets/`**: Contains static assets like images and global CSS.

2.  **Component Design**
    - **Function Components**: All components must be written as **function components** using **React Hooks**. Class components should not be used.
    - **Props Typing**: Use `PropTypes` or TypeScript to define types for component props to prevent bugs.
    - **Props Destructuring**: Always destructure props in the component's signature for better readability.

      ```jsx
      // Bad
      const MyComponent = (props) => <div>{props.name}</div>;

      // Good
      const MyComponent = ({ name }) => <div>{name}</div>;
      ```

3.  **State Management**
    - **Local State**: Use the `useState` hook for state that is local to a single component.
    - **Global State**: Use the `Context API` or a state management library like `Zustand` or `Redux Toolkit` for state that needs to be shared across multiple components (e.g., user authentication status).

4.  **Styling**
    - Use **CSS Modules** or a CSS-in-JS library like **Styled-Components** to scope styles to individual components. This prevents style conflicts in the global scope.

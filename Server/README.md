# Server Coding Conventions

This document outlines the coding standards and best practices for the Node.js/Express server. Adhering to these guidelines ensures consistency, readability, and maintainability of the codebase.

## Overall Conventions

1.  **Formatting**: Code formatting is strictly enforced by **Prettier** and **ESLint**. Do not manually adjust formatting.
2.  **Naming Convention**:
    - **Files**: Use `camelCase` (e.g., `customField.js`).
    - **Variables/Functions**: Use `camelCase` (e.g., `getMeetings`).
    - **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_CONNECTIONS`).

---

## Server-Side Conventions

1.  **Directory Structure**
    - **`model/schema/`**: Contains Mongoose schema definitions (e.g., `account.js`, `user.js`).
    - **`controllers/`**: Contains both the business logic and API endpoint definitions.
        - Each feature has its own directory (e.g., `account/`, `meeting/`).
        - Inside each feature directory:
            - `_routes.js`: Defines the API routes for the feature using Express Router.
            - A JavaScript file with the same name as the directory (e.g., `account.js`) contains the controller functions (business logic).
    - **`middelwares/`**: Contains middleware functions, such as for authentication (`auth.js`).

2.  **API Design**
    - **RESTful Approach**: The API follows REST principles. Resources are represented by plural nouns (e.g., `/api/meetings`), and operations are represented by HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
    - **Response Format**: API responses are in JSON format. The structure may vary between endpoints.

3.  **Asynchronous Operations**
    - All asynchronous database operations and business logic must use **`async/await`** for better readability and error handling.

4.  **Error Handling**
    - Use `try...catch` blocks within each controller function to handle unexpected errors.
    - Errors are logged to the console via `console.error()` and a `400` or `404` status code with a JSON error message is returned to the client.
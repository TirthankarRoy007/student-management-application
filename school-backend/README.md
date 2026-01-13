# School Management System / Learning Tracker API

A robust Node.js/TypeScript backend for managing student learning, subjects, enrollments, and goals. This API allows for creating users, enrolling them in subjects, tracking daily goals, and monitoring progress.

## Tech Stack

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** PostgreSQL
-   **ORM:** Sequelize (TypeScript)
-   **Authentication:** Passport (JWT)
-   **Language:** TypeScript

## Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=3000
    NODE_ENV=development
    
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=school_management
    DB_USER=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_SSL=false
    DB_LOGGING=true

    # Authentication
    JWT_SECRET=your_super_secret_jwt_key
    ```

3.  **Run the Application:**

    -   **Development:**
        ```bash
        npm run dev
        ```
    -   **Production Build:**
        ```bash
        npm run build
        npm start
        ```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

### Authentication (`/auth`)

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | `{ "username": "...", "email": "...", "password": "..." }` |
| `POST` | `/auth/login` | Login user | `{ "email": "...", "password": "..." }` |
| `GET` | `/auth/me` | Get current user info | Headers: `Authorization: Bearer <token>` |

### Subjects (`/subjects`)

Manage academic subjects.
*Note: Create/Update/Delete require 'admin' role (check middleware).*

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/subjects` | List all subjects | - |
| `POST` | `/subjects` | Create a subject | `{ "name": "Math", "color": "#FF5733", "icon": "calculator" }` |
| `PUT` | `/subjects/:id` | Update a subject | `{ "name": "...", ... }` |
| `DELETE` | `/subjects/:id` | Delete a subject | - |

### Enrollments (`/enrollments`)

Manage user enrollments in subjects.

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/enrollments` | Enroll in a subject | `{ "subjectId": "uuid" }` (Check controller for specific body) |
| `GET` | `/enrollments` | Get my enrolled subjects | - |
| `PATCH` | `/enrollments/:id` | Activate/Deactivate | `{ "isActive": boolean }` |

### Goals (`/goals`)

Set and track daily learning goals.

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/goals` | List my goals | - |
| `POST` | `/goals` | Create a daily goal | `{ "subjectId": "uuid", "targetType": "task_count" \| "minutes", "targetValue": 30 }` |
| `PUT` | `/goals/:id` | Update a goal | `{ "targetValue": 45 }` |
| `DELETE` | `/goals/:id` | Delete a goal | - |

### Student Subjects (`/students`)

Alternative endpoints for managing student subjects (potentially for admin or detailed views).

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/students/:id/subjects` | Enroll student | `{ "subjectId": "uuid" }` |
| `GET` | `/students/:id/subjects` | List student subjects | - |
| `DELETE` | `/students/:id/subjects/:sid` | Unenroll student | - |
| `GET` | `/students/:id/subjects/:sid/dashboard` | Subject Dashboard | Returns progress, goals, etc. |

## Data Models

### Subject
-   `id`: UUID
-   `name`: String
-   `color`: String (Hex code for UI)
-   `icon`: String (Icon identifier for UI)

### DailyGoal
-   `id`: UUID
-   `subjectId`: UUID
-   `targetType`: Enum (`task_count`, `minutes`, `mixed`)
-   `targetValue`: Integer

### UserSubject (Enrollment)
-   `id`: UUID
-   `userId`: UUID
-   `subjectId`: UUID
-   `isActive`: Boolean

## UI Integration Tips

1.  **Subject Cards:** Use the `color` and `icon` fields from the Subject model to render visually distinct cards for each subject on the dashboard.
2.  **Goal Tracking:** The backend supports different goal types (`minutes` or `task_count`). Your UI should handle input validation accordingly (e.g., number input for minutes).
3.  **Authentication:** Store the JWT received from `/auth/login` in `localStorage` or a secure cookie and attach it to the `Authorization` header (`Bearer <token>`) for all protected requests.

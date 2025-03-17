# Project Folder Structure

```
prisma/                         # Prisma directory for database management
├── schema.prisma               # Prisma schema defining models, database, and generators
├── migrations/                 # Folder storing migration history
│   ├── <timestamp_folder>/     # Each migration has a timestamped folder
│   │   ├── migration.sql       # SQL script for the migration
|   |   └── ...
│   └── ...                     # Other migration folders
src/
├── app.module.ts               # The application's root module
├── main.ts                     # Entry point (bootstrap)
├── common/                     # Directory containing shared source code
│   ├── decorators/             # Custom decorators
│   ├── dtos/                   # DTOs (Data Transfer Objects)
│   ├── enums/                  # Reusable constants for type safety and consistency
│   ├── filters/                # Exception filters
│   ├── guards/                 # Guards (Authorization, Authentication)
│   ├── interceptors/           # Interceptors
│   ├── interfaces/             # Shared interfaces
│   ├── pipes/                  # Pipes (Validation, Transformation)
│   └── utils/                  # Helper functions or utils
├── config/                     # Application configuration
│   ├── app.config.ts           # Main configuration
│   └── ...                     # Other configuration files (database, mail, etc.)
├── middleware/                 # Custom middleware
├── database/                   # Database module
│   ├── ...                     # Database connection configuration
├── auth/                       # Module Authentication
│   ├── ...                     # Auth strategies (JWT, Passport, etc.)
├── modules/                    # Main modules in the application
|   └── shared/                 # Module contains reusable services
│   └── ...                     # Other modules
├── tests/                      # Test cases
│   ├── unit/                   # Unit tests
│   └── e2e/                    # End-to-end tests
```

### **1. `prisma/` – Database Management with Prisma**

This directory handles database schema, migrations, and Prisma Client.

- **`schema.prisma`** – Defines the database schema, models, and configuration.

  - Specifies database provider (PostgreSQL, MySQL, etc.).
  - Defines tables, relations, and constraints.
  - Configures Prisma Client for querying the database.

- **`migrations/`** – Stores migration history, ensuring schema versioning.
  - `<timestamp_folder>/` – Each migration is stored in a separate timestamped folder.
    - `migration.sql` – SQL script containing schema changes (e.g., new tables, altered columns).
    - Other files (e.g., `steps.json`, `migration.json`) may contain metadata.

**Best Practices:**

- Run `npx prisma migrate dev` during development to apply migrations.
- Use `npx prisma studio` to visually inspect the database.

### **2. `src/` – Main Source Directory**

Contains the core application logic, structured into various modules.

### **2.1 `app.module.ts`** – Root Module

- The entry point that imports and configures all submodules.
- Registers global providers (e.g., database services, authentication).
- Acts as the backbone of the application.

### **2.2 `main.ts`** – Application Bootstrap

- The first file executed when the app starts.
- Configures global middleware, guards, filters, and pipes.
- Calls `app.listen(port)` to start the server.

**Best Practices:**

- Apply global error handling using `app.useGlobalFilters()`.
- Enable validation with `app.useGlobalPipes(new ValidationPipe())`.

### **3. `common/` – Reusable Code & Shared Utilities**

Contains reusable logic that is independent of specific modules.

### **3.1 `decorators/` – Custom Decorators**

- Used to apply reusable metadata or logic to classes/methods.
- Example: `@Public()` decorator to mark routes as publicly accessible.

### **3.2 `dtos/` – Data Transfer Objects (DTOs)**

- Defines request and response data shapes.
- Ensures validation and type safety using `class-validator` and `class-transformer`.

### **3.3 `enums/` – Constants & Type Safety**

- Stores predefined values like user roles (`Admin`, `User`, `Guest`).
- Helps maintain consistency across the application.

### **3.4 `filters/` – Global Exception Handlers**

- Custom error-handling logic for centralized exception management.
- Example: `HttpExceptionFilter` to format API error responses.

### **3.5 `guards/` – Route Protection (Auth, Roles, etc.)**

- Restricts access to endpoints based on roles/permissions.
- Example: `AuthGuard` for JWT authentication.

### **3.6 `interceptors/` – Modifying Requests & Responses**

- Used for logging, caching, modifying data before sending a response.
- Example: `LoggingInterceptor` to log request-response times.

### **3.7 `interfaces/` – Shared TypeScript Interfaces**

- Defines interfaces for models, services, and controllers.
- Helps enforce type safety and maintain clean architecture.

### **3.8 `pipes/` – Validation & Data Transformation**

- Used for data transformation and input validation.
- Example: `ParseIntPipe` ensures `id` parameters are numbers.

### **3.9 `utils/` – Helper Functions**

- Common utility functions that are used across the app.
- Example: Formatting dates, generating random tokens, hashing passwords.

**Best Practices:**

- Use DTOs for all API requests and responses.
- Apply validation globally to prevent incorrect input.

### **4. `config/` – Configuration Management**

Manages application settings, environment variables, and external services.

- **`app.config.ts`** – Stores general app configurations like `PORT`, `DEBUG_MODE`.
- **`database.config.ts`** – Database connection settings (URL, credentials).
- **`jwt.config.ts`** – JWT secret key, expiration time settings.
- **Other configs** – Email service, payment gateway, etc.

**Best Practices:**

- Store secrets (DB password, API keys) in `.env` instead of hardcoding.
- Use `ConfigModule` to load environment variables dynamically.

### **5. `middleware/` – Custom Middleware**

Middleware functions that execute before reaching controllers.

- Example: `LoggerMiddleware` to log every incoming request.
- Example: `CorsMiddleware` to enable Cross-Origin Resource Sharing (CORS).

**Best Practices:**

- Middleware should be lightweight and efficient.
- Use guards instead of middleware for authentication.

### **6. `database/` – Database Module**

Handles database-related functionalities.

- Stores database configurations (`TypeORM`, `Sequelize`, or `Prisma`).
- Defines repositories for handling database queries.

**Best Practices:**

- Use ORM repositories instead of writing raw SQL queries.
- Separate database logic from controllers to keep them clean.

### **7. `auth/` – Authentication & Authorization**

Manages user authentication and security.

- Implements **JWT authentication** (login, token verification).
- Handles **OAuth strategies** (Google, Facebook, etc.).
- Stores authentication-related logic like password hashing.

**Best Practices:**

- Use `bcrypt` to hash passwords before storing them.
- Implement refresh tokens for better security.

### **8. `modules/` – Feature-Based Modules**

Each folder represents a feature module.

- **`shared/`** – Contains services used across multiple modules (e.g., logging, notifications).
- Other feature modules (`users/`, `products/`, `orders/`, etc.).

**Best Practices:**

- Each module should have its own controller, service, and DTOs.
- Avoid placing all logic in a single module—keep features modular.

### **9. `tests/` – Testing (Unit & E2E)**

Ensures application reliability through testing.

- **`unit/`** – Tests individual services, controllers, and helpers.
- **`e2e/`** – End-to-end tests for simulating real user behavior.

**Best Practices:**

- Use Jest for writing unit tests.
- Mock dependencies instead of using the real database in tests.

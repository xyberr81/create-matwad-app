# create-matwad-app

A CLI tool to scaffold a modern full-stack web application, powered by the (patent-pending) MATWAD stack.

## Stack

- **Server**: Express.js, Knex.js, PostgreSQL (w/ Supabase support)
- **Client**: Vite, React, TailwindCSS v4, Shadcn/UI, React Router (Data API)

## Usage

```bash
npx create-matwad-app <project-name>
```

Or globally:

```bash
npm install -g create-matwad-app
create-matwad-app my-app
```

## Features

- Interactive project generation.
- Automated dependency installation for both server and client.
- Automated `shadcn/ui` initialization.
- Pre-configured TailwindCSS v4.
- Ready-to-use directory structure.

## Getting Started

1.  Create your app:
    ```bash
    npx create-matwad-app my-awesome-app
    ```
2.  Start the development servers:

    ```bash
    # Terminal 1
    cd my-awesome-app/server
    npm run dev

    # Terminal 2
    cd my-awesome-app/client
    npm run dev
    ```

## License

ISC

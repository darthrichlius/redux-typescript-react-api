A demo application showcasing how to use RTK (**Redux Toolkit**) with **React** in an **API Rest** context.

## Getting Started

**Requirements**

- **Make**: Required to safely start the application (you can do it manually if you want)
- **Node 18+**: This is a `vitejs` peer dependency
- **npm**: Required to manage packages and run scripts
- **sqlite3**: Required to process data
- **npx**: Required to execute `prisma`

**Instructions**

1. Clone the project.
2. Move to the project root.
3. Execute the make script.

```bash
# The script will start both the client and server development servers
make start
```

**HMR**

Both services have HMR enabled. Yeah! :)

## Project structure

```
├── client
├── Makefile
└── server
```

#### Client

A **React** application using **RTK**, written in **TypeScript**.
The React application is based on **ViteJS**.

**Store**

The store is organized by "domain".
There is only one domain so far: entities.
There are 3 entities: `User`, `Project`, and `Bug`.

#### Server

An **ExpressJS** application written in TypeScript

## License

See License

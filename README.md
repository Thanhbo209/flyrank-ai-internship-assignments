# Task API

A small REST API for managing tasks, built with **Node.js** and **Express**. It exposes a full CRUD cycle over a **SQLite** database and ships with interactive Swagger documentation.

This is a learning project built in incremental stages (see the commit history: `Stage 0` → `Stage 5`).

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses ES modules and top-level `await`)

## Quick start

Clone the repo, then run **one command**:

```bash
npm install && npm start
```

That's it — no database setup required. The server starts on **http://localhost:3000** and interactive docs are at **http://localhost:3000/docs**.

On first launch the app creates the SQLite database, its `tasks` table, and seeds **three example tasks** automatically, so a fresh clone is immediately usable.

> During development, `npm run dev` uses [nodemon](https://www.npmjs.com/package/nodemon) to auto-restart on file changes.

## Storage: why SQLite & where it lives

This project uses **SQLite** (via [`better-sqlite3`](https://www.npmjs.com/package/better-sqlite3)) because it's the simplest way to get real, persistent storage:

- **Single file** — the whole database is one file on disk, nothing to install or administer.
- **Zero setup** — no separate database server or connection strings; the app opens the file directly.
- **Survives restarts** — unlike an in-memory list, your tasks persist across server restarts.

The database file is **`src/db/tasks.db`**. It is **created automatically** the first time the app runs (see `src/db/db.js`), so it does not need to exist beforehand. It is **git-ignored** on purpose — it's a runtime artifact, not source — so it is never committed and **every clone starts fresh** with the seeded example tasks.

## Endpoints

| Method   | Path          | Description                     | Success | Errors |
| -------- | ------------- | ------------------------------- | ------- | ------ |
| `GET`    | `/`           | API info (name, version)        | 200     | —      |
| `GET`    | `/health`     | Health check                    | 200     | —      |
| `GET`    | `/tasks`      | List all tasks                  | 200     | —      |
| `GET`    | `/tasks/:id`  | Get a single task by ID         | 200     | 404    |
| `POST`   | `/tasks`      | Create a task (`title` required)| 201     | 400    |
| `PUT`    | `/tasks/:id`  | Update a task's `title`/`done`  | 200     | 400, 404 |
| `DELETE` | `/tasks/:id`  | Delete a task                   | 204     | 404    |

A task looks like:

```json
{ "id": 1, "title": "Learn TypeScript", "done": true }
```

## Example request

Creating a task with `curl -i` (headers included):

```console
$ curl -i -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Write the README"}'

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 48
ETag: W/"30-ITPU77bzqZPPZ4GNNznB4sPDLco"
Date: Wed, 22 Jul 2026 16:38:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"title":"Write the README","done":false}
```

## Interactive docs (Swagger UI)

Open **http://localhost:3000/docs** to explore every endpoint and run requests straight from the browser with **Try it out** — no curl needed.

![Swagger UI showing the Task API endpoints](docs/swagger.png)

## Project structure

```
.
├── server.js                 # Entry point: boots Express and listens on :3000
├── openapi.json              # OpenAPI 3 spec served at /docs
├── src/
│   ├── app.js                # Wires up routes + Swagger UI
│   ├── db/
│   │   ├── db.js             # Opens SQLite, creates the table, seeds on first run
│   │   └── tasks.db          # SQLite database (auto-created, git-ignored)
│   ├── routes/               # Express routers (tasks, meta)
│   ├── services/             # Business logic
│   └── repositories/         # SQL data access
├── package.json
└── README.md
```

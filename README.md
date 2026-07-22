# Task API

A small REST API for managing tasks, built with **Node.js** and **Express**. It exposes a full CRUD cycle over an in-memory list of tasks and ships with interactive Swagger documentation.

This is a learning project built in incremental stages (see the commit history: `Stage 0` → `Stage 5`).

> **Note:** Tasks are stored in memory, so the list resets every time the server restarts.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses ES modules and top-level `await`)

## Install & Run

```bash
npm install && npm run dev
```

The server starts on **http://localhost:3000**. Interactive docs are at **http://localhost:3000/docs**.

`npm run dev` uses [nodemon](https://www.npmjs.com/package/nodemon) to auto-restart on file changes. For a plain start, use `npm start`.

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
├── server.js       # Express app: routes + Swagger wiring
├── openapi.json    # OpenAPI 3 spec served at /docs
├── package.json
└── README.md
```

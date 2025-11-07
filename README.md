# House Management

This repository contains a React front-end (Vite) and a Node.js/Express back-end for managing household inventory, drinks, and usage data. The application persists data in MongoDB.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose)

## Running with Docker Compose

The included `docker-compose.yml` provisions three containers:

- **mongo** – MongoDB 7 database with a persistent volume (`mongo-data`).
- **server** – Express API exposed on port **5001**.
- **client** – Nginx serving the built React application on port **8080**, proxying `/api/*` requests to the API container.

### 1. Configure environment variables

Update the placeholder secrets in `docker-compose.yml` if needed:

```yaml
server:
  environment:
    PORT: 5001
    MONGO_URI: mongodb://mongo:27017/house_management
    JWT_SECRET: change-me
    HEALTH_TOKEN: change-me
```

Use strong values in production. The `MONGO_URI` already points at the bundled MongoDB container.

### 2. Build and start the stack

From the repository root run:

```bash
docker compose up --build
```

Docker will build the client and server images and start all services. When the containers are healthy, visit:

- Front-end: [http://localhost:8080](http://localhost:8080)
- API docs (Swagger UI): [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

### 3. Managing the stack

- Stop containers: `docker compose down`
- Stop and remove data volume: `docker compose down -v`

The MongoDB volume (`mongo-data`) keeps your database between restarts. Remove it only when you want a clean slate.

## Development without Docker

The client and server can still be run locally with Node.js/Yarn if preferred:

```bash
# Terminal 1 – API
yarn --cwd server install
yarn --cwd server dev

# Terminal 2 – Client
yarn --cwd client install
yarn --cwd client dev --host 0.0.0.0 --port 5173
```

Ensure MongoDB is available locally and that `server/.env` (copy `server/.env.example`) contains the correct connection string and secrets.

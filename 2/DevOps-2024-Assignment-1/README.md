# DevOps 2024 — Assignment 1

Node.js implementation of DevOps 2024 Assignment 1: a CRUD web application running in one container and a persistent MongoDB database running in another.

The project includes a custom Docker bridge network, MongoDB volume persistence, Docker SDK scripts for network inspection and container health management, and a browser UI for creating, editing, completing, and deleting deployment tasks.

## Run locally

Requires Node.js 18 or newer.

```bash
docker compose up --build
```

Open `http://localhost:3000` in a browser.

## Docker management scripts

```bash
npm install
npm run network       # create/inspect the custom bridge network
npm run containers    # list containers and restart an unhealthy app
npm run health-monitor
```

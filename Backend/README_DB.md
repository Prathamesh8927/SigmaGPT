Local MongoDB (Docker)

This project can use a local MongoDB instance for development via Docker Compose.

Steps:

1. Ensure Docker (or Docker Desktop) is installed and running.

2. Start MongoDB:

```powershell
cd Backend
docker compose up -d
```

This will start a MongoDB container listening on localhost:27017.

3. Update your `.env` in `Backend/.env` to point to the local database (or set the env var):

```
MONGODB_URI=mongodb://localhost:27017/sigmagpt
```

4. Start the server (from project root):

```powershell
cd Backend
node server.js
```

Notes:
- The current `Backend/.env` contains your Atlas connection string. If you want to switch back to Atlas, restore that value.
- The Mongo container persists data in a Docker volume named `mongo-data`.
- If you prefer MongoDB with authentication, update `docker-compose.yml` and the connection string accordingly.

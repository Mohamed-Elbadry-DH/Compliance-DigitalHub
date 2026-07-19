# Conformix — Production Scaffold

Production-grade rebuild of the Conformix prototype: **React (TypeScript) + .NET 8**, Clean Architecture, on-prem via Docker.

See `../docs/ARCHITECTURE.md` for the full design rationale and migration plan.

## What's implemented

This is a **working skeleton**, not the finished app. It ships the full structure plus the **Controls** module end-to-end (Domain → EF Core → Application handlers → API → React feature) as the copy-paste pattern for every other module.

```
conformix/
├── backend/    .NET 8 solution (Domain / Application / Infrastructure / Api + tests)
├── frontend/   Vite + React + TypeScript SPA
└── deploy/     docker-compose (api + postgres + minio + web)
```

## Run it locally (dev)

**Prerequisites:** .NET 8 SDK, Node 20+, and a PostgreSQL instance (or use the Docker one below).

### Backend
```bash
cd backend
dotnet restore
dotnet build                       # compile the whole solution
dotnet test                        # run unit tests

# create the database schema (first time):
dotnet tool install --global dotnet-ef
dotnet ef migrations add Initial -p src/Conformix.Infrastructure -s src/Conformix.Api
dotnet ef database update          -p src/Conformix.Infrastructure -s src/Conformix.Api

dotnet run --project src/Conformix.Api   # API on http://localhost:5080, Swagger at /swagger
```

### Frontend
```bash
cd frontend
npm install
npm run build      # typecheck + production build  (already verified passing)
npm run dev        # dev server on http://localhost:5173, proxies /api → :5080
```

## Run the whole stack (on-prem)
```bash
cd deploy
docker compose up --build
# web:     http://localhost:8080
# api:     http://localhost:5080/swagger
# minio:   http://localhost:9001  (console)
```

## Next steps (from the migration plan)

1. Seed the six frameworks + controls by porting `data.js`.
2. Wire login/refresh (Identity + JWT) and lock endpoints by role.
3. Reproduce each remaining module using the Controls slice as the template.
4. Add ActivityLog everywhere, evidence upload to MinIO, report export, SSO.

# Archived & Deprecated Files (`useless/`)

This directory safely archives deprecated, duplicate, boilerplate, and legacy artifacts from the active production codebase to ensure a clean, enterprise-grade directory structure.

### Structure:

- **`legacy_config/`**:
  - `vercel.json` (root duplicate — active configuration is inside `frontend/vercel.json`)
  - `docker-compose.yml` & `docker-compose.prod.yml` (superseded by Render cloud deployments)
  - `run-project.js` (legacy CommonJS runner with deprecation warnings)
  - `backend-package.json` & `backend-package-lock.json` (unused top-level backend package)
  - `backend.dockerignore` (unified into root `.dockerignore`)
  - `frontend.gitignore` (unified into root `.gitignore`)

- **`legacy_docs/`**:
  - `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md` (unmaintained boilerplate)
  - `frontend-README.md` (boilerplate starter readme)
  - `docs/api-reference.md` (superseded by comprehensive `docs/API_DOCUMENTATION.md`)
  - `docs/deployment.md` (superseded by modern Vercel + Render CI/CD flow)
  - `docs/agents.md` (superseded by `docs/architecture.md`)

- **`legacy_workflows/`**:
  - `.github/workflows/deploy.yml`, `docker.yml`, `security.yml` (unconfigured / non-functional external secret workflows; active verified CI is in `.github/workflows/ci.yml`)

- **`legacy_assets/`**:
  - `hero.png` (unreferenced 13KB static image)
  - `react.svg`, `vite.svg` (starter Vite templates)

- **`legacy_shims/`**:
  - `backend/services/agent/routes/agent.routes.js` (redundant wrapper for `agent.route.js`)
  - `backend/services/auth/controllers/auth.controller.js` (redundant wrapper for `auth.controllers.js`)

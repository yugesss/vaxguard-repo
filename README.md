# VaxGuard

VaxGuard is a React dashboard prototype for vaccine cold-chain operations. It demonstrates facility and temperature monitoring views, vaccine inventory, storage slots, and first-expiry-first-out (FEFO) prioritization using local sample data.

> **Demo status:** This repository is a frontend prototype. It does not connect to a backend, sensors, shipment services, or an identity provider. Dashboard metrics and many screens are illustrative; inventory batches and storage units are simulated. Do not use it to make real vaccine storage, safety, or clinical decisions.

## Requirements

- Node.js 22.12 or later
- npm (the version bundled with Node.js is suitable)

## Setup

```bash
git clone <repository-url>
cd VAXGUARD-SOLVEATHON2
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Use the Marketing, Login, and Operations switcher in the page header to explore the prototype. The Login screen is a UI demonstration only; it does not authenticate users.

## Environment variables

No environment variables are required or read by the application today. There is no API URL, credential, or device endpoint to configure. Vite supports client-side variables prefixed with `VITE_`, but values exposed this way are bundled into browser code and must never contain secrets.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the static frontend into `dist/`. |
| `npm run preview` | Serve the most recent production build locally. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the FEFO unit tests with Node's built-in test runner. |

To verify a production build locally:

```bash
npm run build
npm run preview
```

The generated `dist/` directory can be hosted by a static web server. No application server is included.

## Project structure

```text
src/
  App.jsx                 Page layouts and dashboard/inventory views
  main.jsx                React application entry point
  *.css                   Global and application styles
  assets/                 Images and icons
lib/
  api/useBatches.ts       Demo-data hook (not a network API client)
  data/batches.ts         Simulated inventory and storage-unit records
  fefo.ts                 Expiry validation, risk status, and FEFO ordering
  fefo.test.ts            FEFO unit tests
sample-data/
  sample-batches.json     Small, shareable FEFO fixture
docs/
  TECHNICAL_DESIGN.md     Architecture, data flow, and design notes
  SAMPLE_DATA_AND_TEST_CASES.md
```

See [the Technical Design Document](docs/TECHNICAL_DESIGN.md) for architecture and implementation boundaries, and [Sample Data and Test Cases](docs/SAMPLE_DATA_AND_TEST_CASES.md) for the fixture format and test coverage.

## Data and safety

The inventory hook returns in-memory demo records from `lib/data/batches.ts`; it does not make requests. The operations UI also uses illustrative, hard-coded readings and metrics, and the inventory FEFO view uses a fixed demonstration date so its example statuses remain stable. The fixture in `sample-data/sample-batches.json` is synthetic.

This is not a validated cold-chain monitoring system. Temperature readings, alerts, inventory totals, and FEFO classifications must be independently verified before any operational use.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

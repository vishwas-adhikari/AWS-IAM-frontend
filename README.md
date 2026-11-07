# AWS IAM Risk Analyzer (Frontend)

React dashboard for CloudLens. It starts scans by AWS profile name, shows findings and the risk score, and draws the IAM relationship graph with privilege-escalation paths highlighted.

For the full project overview, see the [CloudLens-IAM README](https://github.com/vishwas-adhikari/CloudLens-IAM).

## Tech Stack
- React 18, TypeScript, Vite
- Tailwind CSS
- react-force-graph-2d for the relationship graph, Recharts for charts

## Setup

Requires Node.js 18+ and the backend running (see `AWS-IAM-backend/README.md`).

```bash
npm install
npm run dev          # http://localhost:5173
```

The API URL defaults to `http://localhost:8000`. To change it, create `.env.local`:
```bash
VITE_API_URL=http://localhost:8000
```

## Pages
- **Connect Account:** choose an AWS profile configured on the backend (or the default credential chain) and start a scan. No keys are entered in the browser.
- **Dashboard:** risk score and finding counts.
- **Risk Findings:** filterable findings. Escalation findings show their path hop by hop, with a link to view it in the graph.
- **Graph Explorer:** identities, trust relationships and escalation edges. Node colours show risk or node type (account root, external account, public, service, federated, account admin); selecting a path highlights its nodes and edges.

## Checks

```bash
npm run typecheck    # TypeScript
npm run build        # production build
npm run lint         # ESLint
```

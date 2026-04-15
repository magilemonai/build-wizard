# build-wizard-api

Cloudflare Worker that proxies Build Wizard frontend requests to the
Anthropic Claude API. The API key lives here as a Worker secret so the
frontend never exposes it.

## Setup

```bash
cd worker
npm install
```

Log in to your Cloudflare account (one time):

```bash
npx wrangler login
```

Set the Anthropic API key as a secret (one time, per environment):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# paste the key when prompted
```

## Run locally

```bash
npm run dev
```

Wrangler serves the Worker at `http://localhost:8787`. The frontend
picks this up automatically when `VITE_WORKER_URL` is unset (see
`src/services/api.js`).

Quick smoke test:

```bash
curl -s -X POST http://localhost:8787/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"test","messages":[{"role":"user","content":"hi"}]}'
```

## Deploy

```bash
npm run deploy
```

Then point the frontend at the deployed URL by setting
`VITE_WORKER_URL` in the Vite build environment (e.g. a GitHub Actions
secret, or a local `.env.production`).

## Endpoints

- `POST /api/chat` — `{ messages, sessionId }` in, `{ response, usage }` out.
- `OPTIONS /api/chat` — CORS preflight. Allowed origins: `https://build.codywymore.com`, `http://localhost:5173`.

## Limits

- Rate limit: 60 requests per hour per IP.
- Model: `claude-sonnet-4-20250514`, `max_tokens: 1024`.
- No streaming. Simple request/response.

### Note on rate limiting

Buckets live in an in-memory `Map` scoped to a single Worker isolate.
Cloudflare may spin up multiple isolates or recycle them, so the limit
is best-effort. If you need a hard global limit, swap the `Map` for KV
or a Durable Object.

Deployment checklist

- Split the monorepo into two Vercel projects:
  - frontend: deploy the `frontend` folder as a Next.js project. Root `vercel.json` builds frontend only.
  - backend: deploy the `api` folder as a separate Vercel project. Use `api/vercel.json` and `api/index.py` as entrypoint.
- In Vercel dashboard, create two projects and set environment variables:
  - Frontend project: set `NEXT_PUBLIC_API_URL` to the full backend URL (e.g. https://my-backend.vercel.app/api).
  - Backend project: set runtime env vars (API keys, secrets) as needed.
- Ensure CORS is enabled (app/main.py uses CORSMiddleware with origins="*").
- After deploying backend, verify OPTIONS preflight requests reach the backend using Vercel function logs.
- If using custom domains, set `NEXT_PUBLIC_API_URL` accordingly.
- Build & test: deploy backend first, then update frontend env var and deploy frontend.
- Verify: frontend /agent POST succeeds and returns a JSON with `download_url`. Then the download link should be reachable.

import os

from app.main import app

# When Vercel routes requests through /api/*, the FastAPI app should behave as
# if it is mounted at /api. This makes route matching work for both local and
# Vercel deployments.
if os.getenv("VERCEL"):
    app.root_path = "/api"

# Vercel Python supports ASGI apps by exposing the `app` object from this file.

#!/bin/bash
BUILDKIT_PROGRESS=plain docker compose \
  --env-file .env.test.local \
  -f docker-compose-prod.yml \
  -f docker-compose-test.yml \
  up --build --exit-code-from app

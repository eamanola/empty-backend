#!/bin/bash
BUILDKIT_PROGRESS=plain docker compose \
  --env-file .env.production.local \
  -f docker-compose-prod.yml \
  -f docker-compose-mongo.yml \
  -f docker-compose-redis.yml \
  up --build

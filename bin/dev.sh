#!/bin/bash
docker compose \
  --env-file .env.development.local \
  -f docker-compose-prod.yml \
  -f docker-compose-mongo.yml \
  -f docker-compose-redis.yml \
  -f docker-compose-dev.yml \
  up --build

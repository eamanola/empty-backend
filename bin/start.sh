#!/bin/bash
BUILDKIT_PROGRESS=plain ./bin/up-build.sh \
  --env-file .env.production.local \
  -f docker-compose-prod.yml \
  -f docker-compose-mongo.yml \
  -f docker-compose-redis.yml

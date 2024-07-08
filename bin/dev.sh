#!/bin/bash
./bin/up-build.sh \
  --env-file .env.development.local \
  -f docker-compose-prod.yml \
  -f docker-compose-mongo.yml \
  -f docker-compose-redis.yml \
  -f docker-compose-dev.yml

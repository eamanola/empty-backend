#!/bin/bash
./bin/up-build.sh \
  --env-file .env.test.local \
  -f docker-compose-prod.yml \
  -f docker-compose-mongo.yml \
  -f docker-compose-redis.yml \
  -f docker-compose-test.yml \
  --exit-code-from app

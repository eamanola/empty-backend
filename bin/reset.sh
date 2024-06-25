#!/bin/bash
docker compose \
  -f docker-compose-prod.yml \
  -f docker-compose-dev.yml \
  -f docker-compose-test.yml \
  down --remove-orphans

#!/bin/bash
docker compose --env-file .env.production.local -f docker-compose-prod.yml up --build

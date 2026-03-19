#!/bin/bash
# init-db.sh — PostgreSQL initialization script
# Creates both databases and enables pgvector extension.

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create the vector database (main DB is already created by POSTGRES_DB)
    SELECT 'CREATE DATABASE vector_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vector_db')\gexec

    -- Enable pgvector on both databases
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "vector_db" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL

echo "✅ Databases 'smartinventory' and 'vector_db' initialized with pgvector."

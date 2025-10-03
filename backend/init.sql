-- SmartBlood Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create a dedicated user for the application (optional)
-- CREATE USER smartblood_user WITH PASSWORD 'smartblood_password';
-- GRANT ALL PRIVILEGES ON DATABASE smartblood TO smartblood_user;

-- The tables will be created by Flask-SQLAlchemy when the backend starts
-- This file can be used for any initial data or additional configuration

-- Log successful initialization
\echo 'SmartBlood database initialized successfully!'

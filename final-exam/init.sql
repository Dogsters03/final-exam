-- init.sql
-- Simple person registry for PostgreSQL / Docker

CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    birth_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

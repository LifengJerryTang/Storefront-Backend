CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price NUMERIC(9,2) NOT NULL,
  category VARCHAR NOT NULL
);

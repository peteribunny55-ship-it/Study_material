CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  format VARCHAR(32) NOT NULL,
  stadium VARCHAR(128),
  result VARCHAR(64),
  score VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_stats (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  batting_average NUMERIC(6,2),
  strike_rate NUMERIC(6,2),
  bowling_average NUMERIC(6,2),
  wickets INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

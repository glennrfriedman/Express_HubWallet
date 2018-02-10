DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS coins; 

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL,
  token VARCHAR NOT NULL
);

CREATE TABLE coins (
	id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id),
	coin_name VARCHAR(255), 
	coin_id VARCHAR(255),
	symbol VARCHAR(255),
	investment double precision, 
	shares double precision,
	price_per_share double precision,
	date_of_transaction VARCHAR(255)
);

-- seeding dummy data
-- INSERT INTO users (id, first_name, last_name, email, password_digest, token) VALUES (1, 'glenn', 'friedman', 'glenn@glenn.com', 'gmoney92', 1234);
-- INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, date_of_transaction) VALUES (1, 'EOS', 'eos', 358.28, 31.27, '01/01/2018');
-- INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, date_of_transaction) VALUES (1, 'Bitcoin', 'bitcoin', 10000, 31.27, '01/01/2018');

	-- price VARCHAR(255),
	-- price_btc VARCHAR(255),
	-- market_cap VARCHAR(255),
	-- percent_change_1h VARCHAR(255),
	-- percent_change_24h VARCHAR(255),
	-- percent_change_7d VARCHAR(255)
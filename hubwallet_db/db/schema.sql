DROP TABLE users CASCADE; 
DROP TABLE IF EXISTS coins; 

-- might want to add fields here - depends on data coming back from auth0
CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR NOT NULL UNIQUE,
	password_digest VARCHAR NOT NULL,
	created_at integer,
	updated_at integer 
);

-- coin data to be saved, only need a few pieces of information - rest like live pricing and performance 
-- metrics to be calculated in middelware sent to front-end 
CREATE TABLE coins (
	id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id),
	coin_name VARCHAR(255), 
	coin_id VARCHAR(255),
	investment double precision, 
	shares double precision,
	date_of_transaction VARCHAR(255)
);

-- seeding dummy data
INSERT INTO users (id, email, password_digest, created_at, updated_at) VALUES (1, 'glenn@glenn.com', 'gmoney92', 1234, 1243);
INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, date_of_transaction) VALUES (1, 'EOS', 'eos', 358.28, 31.27, '01/01/2018');
INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, date_of_transaction) VALUES (1, 'Bitcoin', 'bitcoin', 10000, 31.27, '01/01/2018');
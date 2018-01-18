const pgp = require('pg-promise')();

const connectionSettings = {
	host: 'localhost',
	port: 5432,
	database: 'hubwallet_db',
	user: 'glennfriedman'
}

const db = pgp(process.env.DATABASE_URL || connectionSettings);

module.exports = db;
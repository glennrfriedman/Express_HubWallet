const axios = require('axios');
const db = require('../db/config');
// const convertTime = require('convert-time');
// const dateformatConverter = require('dateformat-converter');
// const dateFormatLite = require("date-format-lite");
// require('dotenv').config();

// need to add /COIN_ID//?convert=USD
const API_URL = 'https://api.coinmarketcap.com/v1/ticker';

const Coins = {};

Coins.findAllForUser = (req, res, next) => {
	const userId = 1
	db.manyOrNone(
		'SELECT * FROM coins WHERE user_id = $1', [userId]
	).then(data => {
			res.locals.savedCoinData = data;
			next();
		}).catch(err => console.log('ERROR IN Coins.findAll:', err))
}

module.exports = Coins;
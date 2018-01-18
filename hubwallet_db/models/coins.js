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
	// this will need to change to either come from body or params like so 
	// const userId = req.user.id;
	const userId = 1
	db.manyOrNone(
		'SELECT * FROM coins WHERE user_id = $1', [userId]
	).then(data => {
			res.locals.savedCoinData = data;
			next();
		}).catch(err => console.log('ERROR IN Coins.findAll:', err))
},

Coins.getPerformanceData = (req, res, next) => {
	// this will need to be axios.all call
	// create a promise for each coin a user has saved 
	// make call to return data for all of those promises 
	let coinCalls = [];
	const savedCoins = res.locals.savedCoinData;
	savedCoins.forEach(function(coin){
		coinCalls.push(axios(`${API_URL}/${coin.coin_id}`));
	});

	axios.all(coinCalls)
		.then(response => {
			res.locals.currentCoinData = [];
			response.forEach(function(response){
				res.locals.currentCoinData.push(response.data);
			})
			next();
		})
}

module.exports = Coins;
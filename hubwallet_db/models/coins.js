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
	const userId = 1;
	db.manyOrNone(
		'SELECT * FROM coins WHERE user_id = $1', [userId]
	).then(data => {
			// THINK PPS and OTHER CALCS WILL ALL HAPPEN IN THE FRONT END - PERFORMANCE ISSUES? JUST SIMPLE MATH
			// console.log(data);
			// res.locals.coinPerformance = [];
			res.locals.savedCoinData = data;
			// data.forEach(function(coin){
			// 	let coinPerformanceCalc = coin.investment/coin.shares
			// 	res.locals.coinPerformance.push({ pricePerShare: coinPerformanceCalc  })
			// })
			console.log(res.locals.coinPerformance);
			next();
		}).catch(err => console.log('ERROR IN Coins.findAll:', err))
},

Coins.destroy = (req, res, next) => {
	const coin_id = req.params.coin_id;
    db.none(
        'DELETE FROM coins WHERE id = $1', [coin_id])
    			.then(() => {
        		next();
        	}).catch(err => {
        console.log('ERROR IN Coins.destroy', err);
    })
}

Coins.getMarketData = (req, res, next) => {
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
			console.log('response from axios.all is', response)
			response.forEach(function(response){
				res.locals.currentCoinData.push(response.data);
			})
			next();
		})
},

Coins.saveCoin = (req, res, next) => {

	// need to change to req.user.id once implemented in React
	const user_id = req.body.user_id, 
				coin_name = req.body.coin_name,
				coin_id = req.body.coin_id,
				investment = req.body.investment,
				shares = req.body.shares,
				date_of_transaction = req.body.date_of_transaction;

	db.one('INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, date_of_transaction) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user_id, coin_name, coin_id, investment, shares, date_of_transaction])
		.then(newCoinData => {
			res.locals.newCoinData = newCoinData;
			next();
		}).catch(err => {
				console.log('error in saveCoin is', err);
		})
}




module.exports = Coins;
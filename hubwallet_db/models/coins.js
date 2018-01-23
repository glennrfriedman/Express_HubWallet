const axios = require('axios');
const query = require('array-query');
const db = require('../db/config');
// const convertTime = require('convert-time');
// const dateformatConverter = require('dateformat-converter');
// const dateFormatLite = require("date-format-lite");
// require('dotenv').config();

// need to add /COIN_ID//?convert=USD
const API_URL = 'https://api.coinmarketcap.com/v1/ticker';

const Coins = {};

	Coins.search = (req, res, next) => {
        const searchTerm = req.params.searchTerm.toLowerCase();
        axios.get(`${API_URL}/?limit=0`)
            .then(response => {
                res.locals.tickerData = response.data
                let tickerData = res.locals.tickerData
                // console.log(tickerData)
                // right now just searching name, not symbol, could add a toggle for that or maybe try to incorporate both searches
                let searchList = query('id').search(searchTerm).on(tickerData);
                // console.log(searchList);
                res.locals.coinList = searchList;
                next();
            }).catch(err => console.log('ERROR IN Coins.search:', err))
    },

    Coins.findAllForUser = (req, res, next) => {
        // this will need to change to either come from body or params like so 
        // const userId = req.user.id;
        const userId = req.params.id;
        db.manyOrNone(
            'SELECT * FROM coins WHERE user_id = $1', [userId]
        ).then(data => {
            res.locals.savedCoinData = data;
            next();
        }).catch(err => console.log('ERROR IN Coins.findAll:', err))
    },

    Coins.getMarketData = (req, res, next) => {
        // this will need to be axios.all call
        // create a promise for each coin a user has saved 
        // make call to return data for all of those promises 
        let coinCalls = [];
        const savedCoins = res.locals.savedCoinData;
        savedCoins.forEach(function(coin) {
            coinCalls.push(axios(`${API_URL}/${coin.coin_id}`));
        });

        axios.all(coinCalls)
            .then(response => {
                res.locals.currentCoinData = [];
                // console.log('response from axios.all is', response)
                response.forEach(function(response) {
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

module.exports = Coins;
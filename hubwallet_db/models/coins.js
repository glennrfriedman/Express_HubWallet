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

    // edit middleware 
    // need to have 2 edit routes 
    // 1 - Edit route where users can edit investment information porovided 
    // 2 - Edit route where I can insert new coin data from api into the database for each coin 
    //      - this way when I make call from front-end savedCoin data will return the live information as well 
    //      - much easier to present information and do calc if all coin data in same object - avoid trying to implement something like MongoDb

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
        const userId = req.params.id;
        // this will need to be axios.all call
        // create a promise for each coin a user has saved 
        // make call to return data for all of those promises 
        let coinCalls = [];
        let currentSavedCoinData = [];
        const savedCoins = res.locals.savedCoinData;
        savedCoins.forEach(function(coin) {
            coinCalls.push(axios(`${API_URL}/${coin.coin_id}`));
        });

        axios.all(coinCalls)
            .then(response => {
                // OLD LOGIC - returrning new key value with current coin data
                let currentCoinData = [];
                // console.log('response from axios.all is', response)
                response.forEach(function(response) {
                    currentCoinData.push(response.data);
                })
                currentCoinData.forEach(function(response) {
                console.log('response from currentCoinData is ', response[0]);
                let { price_usd, price_btc, market_cap_usd, percent_change_1h, percent_change_24h, percent_change_7d } = response[0];
                        // res.locals.savedCoinData[i].price_usd = 0;
                        // console.log('response in for loop is ', response.data[0].price_usd);
                console.log('length of res.locals.savedCoinData is', res.locals.savedCoinData.length);
                for(var i = 0; i < res.locals.savedCoinData.length; i++){
                    // console.log('coin id from res.locals is', res.locals.savedCoinData[i].coin_id);
                    // console.log('coin id from response is', response[0].id);
                    if (res.locals.savedCoinData[i].coin_id === response[0].id){
                            res.locals.savedCoinData[i].price_usd = price_usd;
                            res.locals.savedCoinData[i].price_btc = price_btc;
                            res.locals.savedCoinData[i].market_cap_usd = market_cap_usd;
                            res.locals.savedCoinData[i].percent_change_1h = percent_change_1h;
                            res.locals.savedCoinData[i].percent_change_24h = percent_change_24h;
                            res.locals.savedCoinData[i].percent_change_7d = percent_change_7d;
                            res.locals.savedCoinData[i].price_per_share_change = price_usd - res.locals.savedCoinData[i].price_per_share;
                            res.locals.savedCoinData[i].net_present_value = price_usd * res.locals.savedCoinData[i].shares;
                            res.locals.savedCoinData[i].return_on_investment_dollars = res.locals.savedCoinData[i].net_present_value - res.locals.savedCoinData[i].investment;
                            res.locals.savedCoinData[i].return_on_investment_percent = res.locals.savedCoinData[i].return_on_investment_dollars / res.locals.savedCoinData[i].investment;
                        }    
                    }
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
            symbol = req.body.symbol,
            date_of_transaction = req.body.date_of_transaction;

        const price_per_share = investment/shares;
            
        db.one('INSERT INTO coins (user_id, coin_name, coin_id, investment, shares, price_per_share, symbol, date_of_transaction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, coin_name, coin_id, investment, shares, price_per_share, symbol, date_of_transaction])
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
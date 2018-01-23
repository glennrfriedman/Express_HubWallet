const router = require('express').Router();

// const auth = require('../services/auth');
const Coins = require('../models/coins')
// NEXT STEPS 
// RETURN SAVED COIN DATA WITH PORTFOLIO CALC 
// 1 - create schema and coin db -- DONE 
// 2 - seed coin db with dummy coin data -- DONE 
// 3 - make calls to db to return saved coin data in postman -- DONE 
// 4 - add middleware to call coinmarketcap api using saved coin data -- DONE
// 				 - return current coin information -- DONE
// 					- calculate portfolio information -- TBD on FRONT END - think its best place to perform
// 5 - render json of current price information and calculated portfolio information @ /api/coins/:id 
// SEARCH -- THIS IS GOING TO BE TRICK since no search functionality in CMC API -- DONE IN BACK END with params /search/:searchTerm
// create route for @ coins/search/:searchTerm which will return list of searched coins 
// POST -- DONE
// create route for @ coins/coinId which will save coin info (name, id, price, shares, getDateTime)
// DELETE -- DONE
// delete a coin from a users account @ /coins/delete
// EDIT 
// add an edit route where users can update price, shares or add another lot
// ADDED - NEED TO ADD .env file with global varaiables along with .gitignore file
// ADDING AUTH
// middleware currently - auth.restrict - replace this with example using auth0 in react-authenticaotion-tutorial
// the Auth.js file in (../services/auth) will use that function instead (partially completed)
// this auth will restrict users unless logged in and return only coins saved to specific users
// auth middleware will be added to all routes GET, POST, EDIT and DELETE
// REACT
// need to add login/logout button 
// add utils folder files and configure 
// AUTH0
// need to go in and configure api for Hub Wallet same was as Chuck Norris API

router.get('/search/:searchTerm',
    // auth.authCheck, // restrict this route to logged in users
    Coins.search,
    (req, res) => {
        res.json({ searchResults: res.locals.coinList });
    });

router.get('/:id/coins',
    // auth.authCheck, // restrict this route to logged in users
    Coins.findAllForUser,
    Coins.getMarketData,
    (req, res) => {
        res.json({ savedCoins: res.locals.savedCoinData, currentCoinData: res.locals.currentCoinData });
    });

router.post('/save',
	// auth.authCheck, // restrict this route to logged in users
		Coins.saveCoin,
		(req, res) => {
			res.json({ newCoin: res.locals.newCoinData });
		});

router.delete('/coins/:coin_id',
    // auth.authCheck, // restrict this route to logged in users
    Coins.destroy,
    (req, res) => {
        res.send('coin deleted');
    });

	
module.exports = router;
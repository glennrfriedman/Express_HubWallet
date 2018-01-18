const router = require('express').Router();

// const auth = require('../services/auth');
const Coins = require('../models/coins')
// NEXT STEPS 
// RETURN SAVED COIN DATA WITH PORTFOLIO CALC 
// 1 - create schema and coin db
// 2 - seed coin db with dummy coin data
// 3 - make calls to db to return saved coin data in postman
// 4 - add middleware to call coinmarketcap api using saved coin data
// 				 - return current coin information 
// 					- calculate portfolio information
// 5 - render json of current price information and calculated portfolio information @ /api/coins/:id
// SEARCH
// create route for @ coins/search/:searchTerm which will return list of searched coins 
// POST 
// create route for @ coins/coinId which will save coin info (name, id, price, shares, getDateTime)
// DELETE
// delete a coin from a users account @ /coins/delete
// EDIT 
// add an edit route where users can update price, shares or add another lot
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

router.get('/coins',
    // auth.authCheck, // restrict this route to logged in users
    Coins.findAllForUser,
    Coins.getPerformanceData,
    (req, res) => {
        res.json({ savedCoins: res.locals.savedCoinData, currentData: res.locals.currentCoinData});
    });

	
module.exports = router;
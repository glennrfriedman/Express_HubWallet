const router = require('express').Router();
// const auth = require('../services/auth');
const Coins = require('../models/coins');

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
    Coins.portfolioData,
    (req, res) => {
        res.json({ savedCoinData: res.locals.savedCoinData, portfolio: res.locals.portfolio });
    });

router.post('/save',
	// auth.authCheck, // restrict this route to logged in users
		Coins.saveCoin,
		(req, res) => {
			res.json({ newCoin: res.locals.newCoinData });
		});

router.post('/:coin_id/edit/',
        // auth.authCheck, // restrict this route to logged in users
        Coins.update,
        (req, res) => {
            res.json({ editedCoin: res.locals.editedCoinData });
        });

router.delete('/coins/:coin_id',
    // auth.authCheck, // restrict this route to logged in users
    Coins.destroy,
    (req, res) => {
        res.send('coin deleted');
    });

	
module.exports = router;
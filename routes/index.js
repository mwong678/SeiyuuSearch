const express = require('express'),
      search  =  require('../controllers/search');

const router = express.Router();

/* home page route */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* search api route */
router.post('/search', search.searchJinkan);

module.exports = router;

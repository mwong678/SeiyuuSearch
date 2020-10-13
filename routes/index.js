const express = require('express'),
      api  =  require('../controllers/api');

const router = express.Router();

/* home page route */
router.get("/", function(req, res, next) {
  res.render("index");
});

/* data controller routes */
router.post("/api/search", api.search);
router.get("/api/find/:type/:mal_id", api.find);
router.get("/api/animelist/:username", api.animelist);

module.exports = router;

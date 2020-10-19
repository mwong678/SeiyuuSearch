const express = require('express'),
      api  =  require('../controllers/api');

const router = express.Router();

/* Render Helper Function */
function renderPage(req, res){
  const findResults = req.findResults,
        titleText = req.title,
        type = req.params.type,
        mal_id = req.params.mal_id;
  res.render( type, { findResults : findResults, titleText: titleText });
}

/* Render Route Functions */
router.get("/", function(req, res, next) { res.render("index"); });
router.get("/search", function(req, res, next) { res.render("search"); });

/* data controller routes */
router.get("/:type/:mal_id", api.find, renderPage);
router.get("/api/animelist/:username", api.animelist);
router.post("/api/search", api.search);

module.exports = router;

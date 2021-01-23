const express = require('express'),
      api  =  require('../controllers/api'),
      session = require('express-session');

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
router.get("/", function(req, res, next) { res.render("search"); });
router.get("/search", function(req, res, next) { res.render("search"); });

/* data controller routes */
router.get("/:type/:mal_id", api.find, renderPage);
router.post("/api/search", api.search);
router.get("/api/animelist/:username", async function(req, res, next) {
  req.session.animelist = await api.animelist(req, res)
  res.send({result: req.session.animelist})
});

module.exports = router;

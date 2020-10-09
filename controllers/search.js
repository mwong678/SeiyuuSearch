const api = require('../util/api');

const searchJinkan = async (req, res) => {
    var results = await api.search(req.body.query);
    res.send({result: results});
}

module.exports = {
    searchJinkan
}
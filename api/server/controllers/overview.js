const overview = require('../models/overview');

module.exports = {
  getProducts: (req, res) => {
    const { query } = req;
    overview.getProducts((err, response) => {
      if (err) { res.status(400).send(err); }
      res.status(200).send(response.rows);
    }, query);
  },
  getProductById: (req, res) => {
    const { productId } = req.params;
    overview.getProductById((err, response) => {
      if (err) { res.status(400).send(err); }
      const dataShaped = response[0].rows[0];
      dataShaped.features = response[1].rows;
      res.status(200).send(response);
    }, productId);
  },
  getStyles: (req, res) => {
    const { productId } = req.params;
    overview.getStyles((err, response) => {
      if (err) { res.status(400).send(err); }
      res.status(200).send(response);
    }, productId);
  },

  getRelated: (req, res) => {
    const { productId } = req.params;
    overview.getRelated((err, related) => {
      if (err) { res.status(400).send(err); }
      res.status(200).send(related);
    }, productId);
  },
};

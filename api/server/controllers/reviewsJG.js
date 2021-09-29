const models = require('../models/reviewsJG.js')
const client = require('../../database/index')

const controller = {

  get: (req, res) => {
    models.getReviews(req, (err, result) => {
      err ? res.status(400).send(err) : res.status(200).send(result);
    });
  },

  getMeta: (req, res) => {
    models.getMeta(req, (err, result) => {
      err ? res.status(400).send(err) : res.status(200).send(result);
    });
  },

  addReview: async (req, res) => {
    try {
      let { rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos, characteristics } = req.body;
      const { product_id } = req.params;

      console.log('LOOK HERE', req.body);
      console.log(characteristics);
      let date = Date.now();
      const queryStr = `INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, ${date}, '${summary}', '${body}', ${recommend}, ${reported}, '${reviewer_name}', '${reviewer_email}', '${response}', ${helpfulness}) RETURNING id`;

      let queryReturn = await client.query(queryStr);
      let newResultId = queryReturn.rows[0].id;


      let charArr = Object.entries(characteristics);
      console.log('sharky', charArr);
      for (let k = 0; k < charArr.length; k++) {
        let charkey = Number(charArr[k][0]);
        let queryCharacteristics = `INSERT INTO character_reviews (characteristic_id, review_id, value) VALUES (${charkey}, ${newResultId}, ${charArr[k][1]})`;
        await client.query(queryCharacteristics);

      }

      console.log('returrrrrn', queryReturn);
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          let queryPhotoStr = `INSERT INTO reviews_photos (review_id, url) VALUES (${newResultId}, '${photos[i]}')`;
          await client.query(queryPhotoStr)
        }
      }
      res.status(200).send('it worked')
    } catch (err) {
      res.status(400).send(err)
    }
    // models.addReview(req, (err, result) => {
    //   err ? res.status(400).send(err) : res.status(200).send(result);
    // });
  },

  updateHelpful: (req, res) => {
    models.updateHelpful(req, (err, result) => {
      err ? res.status(400).send(err) : res.status(200).send(result)
    });
  },

  updateReport: (req, res) => {
    models.updateReport(req, (err, result) => {
      err ? res.status(400).send(err) : res.status(200).send(result)
    });
  },
};

module.exports = controller;

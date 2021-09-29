/* eslint-disable camelcase */
const client = require('../../database/index');

const reviewsJG = {

  getReviews: (req, callback) => {
    const { product_id } = req.params;
    // eslint-disable-next-line camelcase
    const queryReviewStr = `SELECT * FROM reviews WHERE product_id = ${product_id}`;

    const queryPhoto = 'SELECT * FROM reviews_photos';

    const inner = (t1, t2) => {
      const reviews = [];
      for (let i = 0; i < t1.length; i++) {
        reviews.push(t1[i]);
      }

      for (let i = 0; i < reviews.length; i++) {
        const photos = [];
        reviews[i].date = new Date(Number(reviews[i].date));
        for (let k = 0; k < t2.length; k++) {
          if (reviews[i].id === t2[k].review_id) {
            photos.push(t2[k]);
          }
        }
        reviews[i].photos = photos;
      }
      return reviews;
    };

    client.query(queryReviewStr, (err1, reviewResult) => {
      if (err1) {
        callback(err1, null);
      }
      client.query(queryPhoto, (err2, photoReview) => {
        if (err2) {
          callback(err2, null);
        } else {
          const result = inner(reviewResult.rows, photoReview.rows);
          callback(null, result);
        }
      });
    });
  },

  getMeta: (req, callback) => {
    const limit = req.query.count || 100;
    const page = req.query.page || 1;
    const offSet = limit * page - limit;
    const queryStr = `SELECT * FROM characteristics INNER JOIN character_reviews ON characteristics.product_id = character_reviews.characteristic_id limit ${limit} OFFSET ${offSet}`;

    client.query(queryStr, (err, result) => {
      err ? callback(err, null) : callback(null, result.rows)
    });
  },

  // addReview: async (req, callback) => {
  //   try {
  //     let { rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos } = req.body;
  //     const { product_id } = req.params;
  //     console.log(req.body);
  //     let date = Date.now();
  //     const queryStr = `INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, ${date}, '${summary}', '${body}', ${recommend}, ${reported}, '${reviewer_name}', '${reviewer_email}', '${response}', ${helpfulness}) RETURNING id`;

  //     let newResultId = queryReturn.rows[0].id;
  //      console.log(newResultId);
  //     if (photos.length > 0) {
  //       for (let i = 0; i < photos.length; i++) {
  //         let queryPhotoStr = `INSERT INTO reviews_photos (review_id, url) VALUES (${newResultId}, '${photos[i]}')`;
  //         await client.query(queryPhotoStr)
  //       }
  //     }


  //   } catch (err) {
  //     callback(err, null);
  //   }
  // },

  updateHelpful: (req, callback) => {
    let { id } = req.params;
    const queryStr = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${id}`;

    client.query(queryStr, (err, result) => {
      console.log(result);
      err ? callback(err, null) : callback(null, result)
    });
  },

  updateReport: (req, callback) => {
    let { id } = req.params;
    const queryStr = `UPDATE reviews SET reported = true WHERE id = ${id}`;

    client.query(queryStr, (err, result) => {
      err ? callback(err, null) : callback(null, result)
    });
  },
};

module.exports = reviewsJG;

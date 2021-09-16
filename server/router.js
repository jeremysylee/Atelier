const router = require('express').Router();
const cors = require('cors');
const controllers = require('./controllers');
const db = require('../q_and_a_database/index.js');

const overview = require('./controllers/overview');
const reviews = require('./controllers/reviewsJG');

// Overview API
router.get('/products', overview.getProducts);
router.get('/products/:productId', overview.getProductById);
router.get('/products/:productId/styles', overview.getStyles);
router.get('/products/:productId/related', overview.getRelated);

// Reviews API
router
  .route('/reviews/meta')
  .get(reviews.getMeta);

router
  .route('/reviews/:product_id')
  .get(reviews.get)
  .post(reviews.addReview);

router
  .route('/reviews/:id/helpful')
  .put(reviews.updateHelpful);

router
  .route('/reviews/:id/report')
  .put(reviews.updateReport);

// Q&A API
router
  .route('/qa/questions')
  .get((req, res) => {
    let { product_id, count } = req.query;

    if (!count) {
      count = 4;
    }
    db.getQuestions(product_id, count, (err, result) => {
      if (err) {
        res.send('error');
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    const { product_id, body, name, email } = req.body;

    db.addQuestion(product_id, body, name, email, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.send(results);
      }
    });
  });

router
  .route('/qa/questions/:question_id/answers')
  .get((req, res) => {
    let { question_id } = req.params;
    let { count } = req.query;

    if (!count) {
      count = 4;
    }
    db.getAnswers(question_id, count, (err, results) => {
      if (err) {
        res.send('error');
      } else {
        res.send(results);
      }
    });
  })
  .post((req, res) => {
    const { question_id } = req.params;
    let { body, date_written, name, email, photos } = req.body;
    let dt = new Date();
    dt = dt.getTime();
    // console.log(dt);
    if (!date_written) {
      let dt = new Date();
      dt = dt.getTime();
      date_written = dt;
    }
    if (!Array.isArray(photos)) {
      photos = [];
    }
    db.addAnswer(question_id, body, date_written, name, email, photos, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.send(results);
      }
    });
  });

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  // console.log('req.body in helpful put: ', req.body);
  let { question_id } = req.params;
  if (!question_id) {
    res.send('error');
  }
  db.addQuestionHelpful(question_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let { answer_id } = req.params;
  if (!answer_id) {
    res.send('error');
  }
  db.addAnswerHelpful(answer_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.put('/qa/questions/:question_id/report', (req, res) => {
  let { question_id } = req.params;
  if (!question_id) {
    res.send('error');
  }
  db.reportQuestion(question_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.put('/qa/answers/:answer_id/report', (req, res) => {
  let { answer_id } = req.params;
  if (!answer_id) {
    res.send('error');
  }
  db.reportAnswer(answer_id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

module.exports = router;

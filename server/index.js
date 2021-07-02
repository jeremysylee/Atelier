const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');
const db = require('../q_and_a_database/index.js');
const port = 3001;
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router);

module.exports = app;
// app.route('/api/qa/questions')
//   .get((req, res) => {
//     const { product_id, page, count } = req.query;
//     db.getQuestions(product_id, page, count, (err, result) => {
//       if (err) {
//         res.send('error');
//       } else {
//         res.send(result);
//       }
//     });
//   })
//   .post((req, res) => {
//   });

// app.route('/api/questions/:question_id/answers')
//   .get((req, res) => {

//   })
//   .post((req, res) => {

//   });

// app.route('/api/')

// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

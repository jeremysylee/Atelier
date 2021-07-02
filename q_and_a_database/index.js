// const { Pool } = require('pg');
// const config = require('./config.js');

// const pool = new Pool(config);

// // console.log('database connected!');
// // pool.connect(err => {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log('database connected');
// //   }
// // });

// const getQuestions = (product_id, count, callback) => {
//   let queryString = `SELECT * FROM questions WHERE product_id = ${product_id} limit ${count};`;//add index to product_id in postgres

//   pool.query(queryString, (err, result) => {
//     if (err) {
//       callback(err);
//     } else {
//       const resultRows = result.rows;
//       callback(null, resultRows);
//     }
//   });
// };

// const getAnswers = (question_id, count, callback) => {
//   let queryString = `SELECT * FROM answers WHERE question_id = ${question_id} limit ${count};`;

//   pool.query(queryString, (err, result) => {
//     if (err) {
//       callback(err);
//     } else {
//       const resultRows = result.rows;
//       // callback(null, resultRows);
//       //go through each answer
//         //get id
//         //select all urls in answer_photos where id = answer id
//         //answer.photos = result of

//       let iterateResultAsync = async () => {
//         for (let answer of resultRows) {
//         // console.log('answer id: ', answer.id);
//         queryString = `SELECT url FROM answers_photos WHERE answer_id = ${answer.id}`;
//         let result2 = await pool.query(queryString)
//         answer.photos = result2.rows;
//       };

//       // console.log('result Rows: ', resultRows);
//       };

//       iterateResultAsync()
//         .then(() => {
//           callback(null, resultRows);
//         });
//     }
//   });
// };

// const addQuestion = (product_id, body, name, email, callback) => {
//   let queryString = `INSERT INTO questions(product_id, body,
//     name, email, reported, helpfulness) VALUES (${product_id}, '${body}',
//     '${name}', '${email}', 0, 0);`;

//   pool.query(queryString, (err, result) => {
//     if (err) {
//       callback(err);
//     } else {
//       // const resultRows = result.rows;
//       callback(null, 'Question added!');
//     }
//   });
// };

// const addAnswer = (question_id, body, date_written, name, email, photos, callback) => {
//   let queryString = `INSERT INTO answers (question_id, body, date_written,
//     name, email, reported, helpfulness) VALUES (${question_id}, '${body}',
//     ${date_written}, '${name}', '${email}', 0, 0) RETURNING id;`;

//   pool.query(queryString, (err, result) => {
//     if (err) {
//       callback(err);
//     } else {
//       const answer_id = result.rows[0].id;

//       queryString = 'INSERT INTO answers_photos (answer_id, url) VALUES ($1, $2)';

//       photos.forEach((photo) => {
//         pool.query(queryString, [answer_id, photo], (err) => {
//           if (err) {
//             callback(err);
//           }
//         });
//       });
//       callback(null, 'Answer added!');
//     }
//   });
// };

// const addQuestionHelpful = (question_id, callback) => {
//   let queryString =  `UPDATE questions SET helpfulness = helpfulness + 1
//     WHERE id = ${question_id}`;

//   pool.query(queryString, (err, results) => {
//     if (err) {
//       callback(err);
//     } else {
//       callback(null, 'Question marked helpful!');
//     }
//   });
// };

// const addAnswerHelpful = (answer_id, callback) => {
//   let queryString =  `UPDATE answers SET helpfulness = helpfulness + 1
//     WHERE id = ${answer_id}`;

//   pool.query(queryString, (err, results) => {
//     if (err) {
//       callback(err);
//     } else {
//       callback(null, 'Answer marked helpful!');
//     }
//   });
// };

// const reportQuestion = (question_id, callback) => {
//   let queryString = `UPDATE questions SET reported = 1 WHERE
//     id = ${question_id}`;

//   pool.query(queryString, (err) => {
//     if (err) {
//       callback(err);
//     } else {
//       callback(null, 'Question reported!');
//     }
//   });
// };

// const reportAnswer = (answer_id, callback) => {
//   let queryString = `UPDATE answers SET reported = 1 WHERE
//     id = ${answer_id}`;

//   pool.query(queryString, (err) => {
//     if (err) {
//       callback(err);
//     } else {
//       callback(null, 'Answer reported!');
//     }
//   });
// };

// module.exports = {
//   getQuestions,
//   getAnswers,
//   addQuestion,
//   addAnswer,
//   addQuestionHelpful,
//   addAnswerHelpful,
//   reportQuestion,
//   reportAnswer
// };

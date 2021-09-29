const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const csv = require('csv-parser');
const config = require('../config/config');

const client = new Client(config);

client.connect((err) => {
  err ? console.error(err) : console.log('Connected to databse!');
});

const csvPath = path.join(__dirname, '../R&R_CSV/characteristic_reviews.csv');

const characteristicReviewsTable = 'character_reviews';

// id,characteristic_id,review_id,value

const createCharacteristicReviews = `
drop table if exists ${characteristicReviewsTable};
create table ${characteristicReviewsTable} (
  id serial primary key,
  characteristic_id integer not null,
  review_id integer not null,
  value integer not null
);`;

client.query(createCharacteristicReviews).then(() => {
  console.log(`Successfully create lemon`);
});

const stream = client.query(copyFrom(`COPY ${characteristicReviewsTable} FROM STDIN DELIMITER ',' CSV HEADER`));
const fileStream = fs.createReadStream(csvPath);

console.time('execution time');

fileStream.on(`error`, (err) => {
  console.error(`ERROR IN READ STREAM ${err}`);
});

stream.on('error', (err) => console.error(`ERROR IN CSV PATH ${err}`));

stream.on('pipe', () => {
  console.log('STAAART');
});

const alterTable = `
alter table ${characteristicReviewsTable}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS characteristic_reviews_index;
CREATE INDEX IF NOT EXISTS characteristic_reviews_index ON ${characteristicReviewsTable}(review_id);`;

stream.on('finish', () => {
  console.log(`DATA HAS BEEN SUCCESSFULLY LOADED IN ${characteristicReviewsTable}`);
  console.log('STARTING TABLE ALTERATION');
  console.time('alter execution time');
  client.query(alterTable)
    .then(() => {
      console.log('TABLE ALTERATION COMPLETE');
      console.timeEnd('end of alteration');
      client.end();
    })
    .catch((err) => console.error(err));
});

fileStream.on('open', () => {
  console.log('YO JERM!');
  fileStream.pipe(stream);
});

fileStream.on('end', () => {
  console.log('STREAM ENDED');
  console.timeEnd('execution time');
});

module.exports = client;
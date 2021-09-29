const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const csv = require('csv-parser');
const config = require('../config/config');
const client = new Client(config);

client.connect((err) => {
  err ? console.error(err) : console.log('Connected to database!');
});

const csvPath = path.join(__dirname, '../R&R_CSV/reviews_photos.csv');

const reviewsPhotosTable = 'reviews_photos';

// id,review_id,url

const createReviewsPhotos = `
drop table if exists ${reviewsPhotosTable};
create table ${reviewsPhotosTable} (
  id serial primary key,
  review_id integer not null,
  url text not null
);`;

client.query(createReviewsPhotos).then(() => {
  console.log(`Successfully create lemon`);
});

const stream = client.query(copyFrom(`COPY ${reviewsPhotosTable} FROM STDIN DELIMITER ',' CSV HEADER`));
const fileStream = fs.createReadStream(csvPath);

console.time('execution time');

fileStream.on('error', (err) => {
  console.error(`ERROR IN READ STREAM ${err}`);
});

stream.on('error', (err) => {
  console.error(`ERROR IN CSV PATH ${err}`);
});

const alterTable = `
alter table ${reviewsPhotosTable}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS reviews_photos_index;
CREATE INDEX IF NOT EXISTS reviews_photos_index ON ${reviewsPhotosTable}(review_id);`;

stream.on('finish', () => {
  console.log(`DATA HAS BEEN SUCCESSFULLY LOADED IN ${reviewsPhotosTable}`);
  console.log('STARTING TABLE ALTERATION');
  console.time('alter execution time');
  client.query(alterTable)
    .then(() => {
      console.log('TABLE ALTERATION COMPLETE');
      console.timeEnd('end of alteration');
      client.end();
    });
});

fileStream.on('open', () => fileStream.pipe(stream));

fileStream.on('end', () => {
  console.log('STREAM ENDED');
  console.timeEnd('execution time');
});

module.exports = client;

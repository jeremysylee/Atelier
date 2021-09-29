const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const csv = require('csv-parser');
const config = require('../config/config.js');

const client = new Client(config);

client.connect((err) => {
  err ? console.error(err) : console.log('Connected to database!');
});

const csvPath = path.join(__dirname, '../R&R_CSV/reviews.csv');

const reviewsTable = 'reviews';

const createReviews = `
drop table if exists ${reviewsTable};
create table ${reviewsTable} (
  id serial primary key,
  product_id integer not null,
  rating integer not null,
  date bigint not null,
  summary varchar(250) not null,
  body varchar(1000) not null,
  recommend boolean not null,
  reported boolean not null default false,
  reviewer_name varchar(50) not null,
  reviewer_email varchar(50) not null,
  response varchar(1000) not null,
  helpfulness integer not null default 0
  );`;

client.query(createReviews).then(() => {
  console.log(`Successfully create lemon`);
});

const stream = client.query(copyFrom(`COPY ${reviewsTable} FROM STDIN DELIMITER ',' CSV HEADER;`)); // STDIN = standard input
const fileStream = fs.createReadStream(csvPath);

console.time('execution time');

fileStream.on('error', (err) => {
  console.error(`ERROR IN READ STREAM ${err}`);
});

stream.on('error', (err) => {
  console.error(`ERROR IN CSV PATH ${err}`);
});

const alterTable = `
alter table ${reviewsTable}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS reviews_index;
CREATE INDEX IF NOT EXISTS reviews_index ON ${reviewsTable}(product_id);`;

stream.on('finish', () => {
  console.log(`DATA HAS BEEN SUCCESSFULLY LOADED IN ${reviewsTable}`);
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
  fileStream.pipe(stream);
});

fileStream.on('end', () => {
  console.log('STREAM ENDED');
  console.timeEnd('execution time');
});

module.exports = client;

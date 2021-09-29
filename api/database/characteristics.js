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

const csvPath = path.join(__dirname, '../R&R_CSV/characteristics.csv');

const characteristicsTable = 'characteristics';
// id,product_id,name
const createCharacteristics = `
drop table if exists ${characteristicsTable};
create table ${characteristicsTable} (
  id serial primary key,
  product_id integer not null,
  name text not null
);`;

client.query(createCharacteristics).then(() => {
  console.log('Successfully created lemon');
});

const stream = client.query(copyFrom(`COPY ${characteristicsTable} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(csvPath);

console.time('execution time');

fileStream.on('error', (err) => {
  console.error(`ERROR IN READ STREAM ${err}`);
});

stream.on('error', (err) => {
  console.error(`ERROR IN CSV PATH ${err}`);
});

const alterTable = `
alter table ${characteristicsTable}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS characteristics_index;
CREATE INDEX IF NOT EXISTS characteristics_index ON ${characteristicsTable}(product_id);`;

stream.on('finish', () => {
  console.log(`DATA HAS BEEN SUCCESSFULLY LOADED IN ${characteristicsTable}`);
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

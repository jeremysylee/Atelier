const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

const seedRelated = (err, client, release) => new Promise((resolve, reject) => {
  if (err) { reject(err); }
  const relatedCsvPath = path.join(__dirname, '../../raw_files/relatedClean.csv');
  const readFileStream = fs.createReadStream(relatedCsvPath);
  const stream = client.query(copyFrom('COPY related_products FROM STDIN CSV HEADER'));

  readFileStream.on('error', (error) => {
    console.log('error in related readFilestream ', error);
  });
  readFileStream.on('open', () => {
    console.log('SEEDING related: readfilestream open');
    console.time('seedTime-related');
    readFileStream.pipe(stream);
  });

  stream.on('error', (error) => console.log('error in related write stream, ', error));
  stream.on('finish', () => {
    console.timeEnd('seedTime-related');
    console.log('COMPLETE: related_products table seeded');
    resolve();
    release();
  });

  readFileStream.on('close', () => {
    console.log('readfilestream related closed... still writing');
  });
});

module.exports = seedRelated;

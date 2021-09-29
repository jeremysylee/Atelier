const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

module.exports = (err, client) => new Promise((resolve, reject) => {
  if (err) { reject(err); }
  const skusCsvPath = path.join(__dirname, '../../raw_files/skus.csv');
  const readFileStream = fs.createReadStream(skusCsvPath);
  const stream = client.query(copyFrom('COPY skus FROM STDIN WITH (FORMAT CSV, HEADER)'));

  readFileStream.on('error', (error) => console.log(error));
  readFileStream.on('open', () => {
    console.log('SEEDING skus: readstream open');
    console.time('seedTime-skus');
    readFileStream.pipe(stream);
  });

  stream.on('error', (error) => console.log('sku stream error', error));

  stream.on('data', () => {
    console.log('hello');
  });

  stream.on('finish', () => {
    console.timeEnd('seedTime-skus');
    console.log('COMPLETE: skus table seeded');
    resolve();
  });

  readFileStream.on('close', () => {
    console.log('readstream-skus closed... still writing');
  });
});

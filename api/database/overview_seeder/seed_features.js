const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

const seedFeatures = (err, client) => new Promise((resolve, reject) => {
  if (err) { reject(err); }
  const featuresCsvPath = path.join(__dirname, '../../raw_files/features.csv');
  const readFileStream = fs.createReadStream(featuresCsvPath);
  const stream = client.query(copyFrom('COPY features FROM STDIN CSV HEADER'));

  readFileStream.on('error', (error) => console.log('error in features readStream ', error));
  readFileStream.on('open', () => {
    console.log('SEEDING features: readfilestream open');
    console.time('seedTime-features');
    readFileStream.pipe(stream);
  });

  stream.on('error', (error) => console.log('error in features stream', error));
  stream.on('finish', () => {
    console.timeEnd('seedTime-features');
    console.log('COMPLETE: features table seeded');
    resolve();
  });

  readFileStream.on('close', () => console.log('readfileStream-features closed... still writing'));
});

module.exports = seedFeatures;

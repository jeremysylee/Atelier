const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

module.exports = (err, client) => new Promise((resolve, reject) => {
  if (err) { reject(err); }

  const stylesCsvPath = path.join(__dirname, '../../raw_files/styles.csv');

  const stream = client.query(copyFrom('COPY styles FROM STDIN WITH (FORMAT CSV, HEADER, NULL "null")'));
  const readFileStream = fs.createReadStream(stylesCsvPath);

  readFileStream.on('error', (error) => console.log('styles readFileStream error', error));
  readFileStream.on('open', () => {
    console.log('SEEDING styles: readfilestream open');
    console.time('seedTime-styles');
    readFileStream.pipe(stream);
  });

  stream.on('error', (error) => console.log('styles stream error', error));
  stream.on('finish', () => {
    console.timeEnd('seedTime-styles');
    console.log('COMPLETE: styles table seeded');
    resolve();
  });

  readFileStream.on('close', () => {
    console.log('readfilestream-styles closed... still writing');
  });
});

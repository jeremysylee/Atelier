const fs = require('fs');
const path = require('path');
const { parse } = require('fast-csv');

const seedPhotos = (err, client) => new Promise((resolve, reject) => {
  if (err) { reject(err); }
  let lineCount = 0;

  const queryInsert = 'INSERT INTO photos VALUES ($1, $2, $3, $4)';
  const photosCsvPath = path.join(__dirname, '../../raw_files/photos2.csv');
  const readStream = fs.createReadStream(photosCsvPath);

  const parseStream = parse();

  const insert = (data) => {
    if (lineCount > 0) {
      client.query(queryInsert, data, (error) => {
        if (error) { console.log(error); }
      });
    }
    lineCount += 1;
  };

  readStream.on('error', (error) => { console.log('error in photos readStream', error); });

  readStream.on('open', () => {
    console.log('SEEDING photos: readStream open');
    console.time('seedTime-photos');
    readStream.pipe(parseStream);
  });

  parseStream.on('error', (error) => {
    console.log('Parsing Error: ', error, 'linecount', lineCount);
    throw Error;
  });

  parseStream.on('data', (chunk) => {
    insert(chunk);
  });

  parseStream.on('finish', () => {
    console.timeEnd('seedTime-photos');
    console.log('COMPLETE: photos table seeded');
    resolve();
  });

  readStream.on('close', () => {
    console.log('readStream-photos closed... still writing');
  });
});

module.exports = seedPhotos;

// const copyFrom = require('pg-copy-streams').from;
// const fs = require('fs');
// const path = require('path');
// const csv = require('@fast-csv/format');
// const csv2 = require('fast-csv');

// const seedPhotos = (err, client) => new Promise((resolve, reject) => {
//   if (err) { reject(err); }
//   const photosCsvPath = path.join(__dirname, '../../raw_files/photos.csv');
//   const readFileStream = fs.createReadStream(photosCsvPath);
//   const stream = client.query(copyFrom('COPY photos FROM STDIN CSV HEADER'));

//   // const cleanse = csv2.format({ headers: true, quoteColumns: true, quoteHeaders: false });

//   // cleanse.on('data', (data) => {
//   //   console.log('data', data.toString());
//   // })
//   //   // .parseStream({ headers: true })
//   //   // .transform((data) => ({
//   //   //   url: data.url.toUpperCase(),
//   //   // }));

//   readFileStream.on('error', (error) => {
//     console.log('error in photos readStream', error);
//   });
//   readFileStream.on('open', () => {
//     console.log('SEEDING photos: readfilestream open');
//     console.time('seedTime-photos');
//     readFileStream.pipe(stream)
//   });

//   stream.on('error', (error) => console.log('error in photos stream ', error));
//   stream.on('finish', () => {
//     console.log('COMPLETE: photos table seeded');
//     console.timeEnd('seedTime-photos');
//     resolve();
//   });

//   readFileStream.on('close', () => {
//     console.log('readfileStream-photos closed... still writing');
//   });
// });

// module.exports = seedPhotos;

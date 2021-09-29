const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

function seedProducts(err, client) {
  return new Promise((resolve, reject) => {
    const productCsvPath = path.join(__dirname, '../../raw_files/product.csv');
    const readFileStream = fs.createReadStream(productCsvPath);
    const stream = client.query(copyFrom('COPY product FROM STDIN WITH (FORMAT CSV, HEADER, NULL "null")'));

    readFileStream.on('error', reject);

    readFileStream.on('open', () => {
      console.log('SEEDING products: readfilestream open');
      console.time('seedTime-products');
      readFileStream.pipe(stream);
    });

    stream.on('finish', () => {
      console.timeEnd('seedTime-products');
      console.log('COMPLETE: product table seeded');
      resolve();
    });

    readFileStream.on('close', () => {
      console.log('readfilestream-products closed... still writing');
    });

    stream.on('error', reject);
  });
}

module.exports = seedProducts;

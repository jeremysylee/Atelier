const { Pool } = require('pg');
const config = require('../../config/config');
const seedProducts = require('./seed_products');
const seedFeatures = require('./seed_features');
const seedStyles = require('./seed_styles');
const seedPhotos = require('./seed_photos');
const seedSkus = require('./seed_skus');
const seedRelated = require('./seed_related');

const pool = new Pool(config);

pool.connect((err, client, release) => {
  seedProducts(err, client)
    .then(() => {
      seedFeatures(err, client)
        .then(() => {
          seedStyles(err, client)
            .then(() => {
              seedPhotos(err, client)
                .then(() => {
                  seedSkus(err, client)
                    .then(() => {
                      seedRelated(err, client, release);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
            });
        });
    });
});

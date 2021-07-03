// const db = require('../database/index.js');
// const createProductTableQuery = require('../database/ETL_Products');
const app = require('../server/server');
const { Pool } = require('pg');
const config = require('../config/config.js');
const axios = require('axios');
const supertest = require('supertest');

const pool = new Pool(config);

beforeAll(() => {
  pool.connect((err, client) => {
    if (err) { console.error(err) }
    client.release()
  });
});

afterAll(() => {
  pool.end()
});

describe('PostgreSQL up and running', () => {
  test('database is connected', () => {
    pool.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
      if (err) { console.log('failed'); }
      expect(res.rows[0].message).toBe('Hello world!')
    })
  });
});

describe('API Requests return property data', () => {
  test('products get request returns', async () => {
    await supertest(app).get('/api/products')
    .expect(200)
    .then((response) => {
      expect(response.body[0].name).toEqual('Camo Onesie');
    });
  });
});




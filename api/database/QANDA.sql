CREATE DATABASE qanda;

\c qanda;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT,
  body VARCHAR,
  date_written BIGINT,
  name VARCHAR,
  email VARCHAR,
  reported INT,
  helpfulness INT
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions (id),
  body VARCHAR,
  date_written BIGINT,
  name VARCHAR,
  email VARCHAR,
  reported INT,
  helpfulness INT
);

CREATE TABLE answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answers (id),
  url VARCHAR
);

COPY questions FROM '/Users/miguelbuenviaje/SDC/q_and_a_CSV/questions.csv' DELIMITER ',' CSV HEADER;

SELECT setval('questions_id_seq', (SELECT MAX(id)+1 FROM questions), false);

COPY answers FROM '/Users/miguelbuenviaje/SDC/q_and_a_CSV/answers.csv' DELIMITER ',' CSV HEADER;

SELECT setval('answers_id_seq', (SELECT MAX(id)+1 FROM answers), false);

COPY answers_photos FROM '/Users/miguelbuenviaje/SDC/q_and_a_CSV/answers_photos.csv' DELIMITER ',' CSV HEADER;

SELECT setval('answers_photos_id_seq', (SELECT MAX(id)+1 FROM answers_photos), false);

-- create index idx_questions_product_id on questions(product_id);
--  create index idx_answers_question_id on answers(question_id);
-- create index idx_answers_photos_answer_id on answers_photos(answer_id);

-- CREATE DATABASE qanda;

-- \c qanda;

-- CREATE TABLE users (
--   id serial PRIMARY KEY,
--   name VARCHAR,
--   email VARCHAR,
--   UNIQUE (name, email)
-- );

-- CREATE TABLE questions (
--   id serial PRIMARY KEY,
--   product_id INT,
--   body VARCHAR,
--   date_written BIGINT,
--   userId INT REFERENCES users (id),
--   reported INT,
--   helpfulness INT
-- );

-- CREATE TABLE answers (
--   id serial PRIMARY KEY,
--   question_id INT REFERENCES questions (id),
--   body VARCHAR,
--   date_written BIGINT,
--   userId INT REFERENCES users (id),
--   reported INT,
--   helpfulness INT
-- );

-- CREATE TABLE answers_photos (
--   id serial PRIMARY KEY,
--   answer_id INT REFERENCES answers (id),
--   url VARCHAR
-- );

-- CREATE TABLE questions_temp (
--   id serial PRIMARY KEY,
--   product_id INT,
--   body VARCHAR,
--   date_written BIGINT,
--   name VARCHAR,
--   email VARCHAR,
--   reported INT,
--   helpfulness INT
-- );

-- COPY questions_temp FROM '/Users/miguelbuenviaje/SDC/q_and_a_CSV/questions.csv' DELIMITER ',' CSV HEADER;

-- INSERT INTO users (name, email) SELECT DISTINCT name, email FROM questions_temp;

-- INSERT INTO questions (product_id, body, date_written, reported, helpful, userId) SELECT product_id, body, date_written, reported, helpful,
--   (SELECT id FROM users WHERE name = name AND email = email) FROM questions_temp;

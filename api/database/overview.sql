DROP TABLE IF EXISTS related_products CASCADE;
DROP TABLE IF EXISTS skus CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS product;

CREATE TABLE product (
  id SERIAL,
  name VARCHAR,
  slogan VARCHAR,
  description VARCHAR,
  category VARCHAR,
  default_price VARCHAR,
  PRIMARY KEY(id)
);

CREATE TABLE features (
  id SERIAL,
  product_id INTEGER,
  feature VARCHAR(25),
  value VARCHAR(250),
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES product(id)
      ON UPDATE CASCADE
);

CREATE TABLE styles (
  id SERIAL,
  product_id INTEGER,
  name VARCHAR(250),
  sale_price INTEGER,
  original_price INTEGER,
  default_style BOOLEAN,
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES product(id)
      ON UPDATE CASCADE
);

CREATE INDEX styles_id_idx ON styles USING btree (id ASC nulls LAST);

CREATE TABLE photos (
  id SERIAL,
  style_id INTEGER,
  url VARCHAR(300),
  thumbnail_url VARCHAR(300),
  PRIMARY KEY(id),
  CONSTRAINT fk_styles
    FOREIGN KEY(style_id)
      REFERENCES styles(id)
      ON UPDATE CASCADE
);

CREATE TABLE skus (
  id SERIAL,
  style_id INTEGER,
  size VARCHAR(25),
  quantity INTEGER,
  PRIMARY KEY(id),
  CONSTRAINT fk_style
    FOREIGN KEY(style_id)
      REFERENCES styles(id)
      ON UPDATE CASCADE
);

CREATE TABLE related_products (
  id SERIAL,
  current_product_id INT,
  related_product_id INT,
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(current_product_id)
      REFERENCES product(id)
      ON UPDATE CASCADE,
  CONSTRAINT fk_relatedProduct
    FOREIGN KEY(related_product_id)
      REFERENCES product(id)
      ON UPDATE CASCADE
);

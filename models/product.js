const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageURL;
    this.price = parseFloat(price, 2);
    this.description = description;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title,price, imageUrl, description) VALUES (?, ?, ?,?) ",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM products WHERE products.id =?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
  }
};

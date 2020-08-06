const http = require("http"); // http core module
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const sequelize = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

// Models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const { use } = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use((req, res, next) => {
  User.findOne({
    where: {
      id: 1,
    },
  })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("err", err);
    });
});

//Routes
app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

// Association
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Syncing JS Definitions to the Database
// Dont use {force : true} in production cause it have to delete all your value on table
sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    // console.log("result", result);
    return User.findOne({
      where: {
        id: 1,
      },
    });
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "admin",
        email: "admin@email.com",
        password: "admin123",
      });
    }

    return user;
  })
  .then((user) => {
    user.createCart();
  })
  .then((cart) => {
    const port = process.env.PORT || 4000;
    http.createServer(app).listen(port);
  })
  .catch((err) => {
    console.log("err", err);
  });

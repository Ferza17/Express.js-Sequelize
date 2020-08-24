const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

// Call Back Functions
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "All Products",
        path: "/products",
        hasProduct: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err", err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findOne({ where: { id: prodId } })
    .then((result) => {
      console.log("result", result);
      res.render("shop/product-detail", {
        product: result,
        pageTitle: "Product Details",
        path: "/products",
        hasProduct: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err", err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((result) => {
      res.render("shop/index", {
        prods: result,
        pageTitle: "Shop",
        path: "/",
        hasProduct: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err", err));
};

exports.getCart = async (req, res, next) => {
  await req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((cartProducts) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: cartProducts,
          });
        })
        .catch((err) => {
          console.log("Err :>> ", Err);
        });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findOne({
        where: {
          id: prodId,
        },
      });
    })
    .then((_product) => {
      return fetchedCart.addProduct(_product, {
        through: {
          quantity: newQuantity,
        },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log("err >> ", err));
};
// TODO Delete Product
exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      console.log("result :>> ", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log("err :>> ", err));
};

exports.getCheckout = (req, res, next) => {
  res.render({
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log("err :>> ", err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

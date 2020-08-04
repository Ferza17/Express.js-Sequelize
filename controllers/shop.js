const Product = require("../models/product");
const Cart = require("../models/cart");

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
      console.log('result', result)
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

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    Product.fetchAll((products) => {
      products.map((product, productIndex) => {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      });
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render({
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

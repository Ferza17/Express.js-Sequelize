const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Create product with association methods
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageURL,
      description: description,
    })
    .then((result) => {
      console.log("Product Created !");
      res.redirect("/");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  await req.user
    .getProducts({ where: { id: req.params.productId } })
    .then((result) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: result[0],
      });
    })
    .catch((err) => {
      console.log("err find id", err);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = parseFloat(req.body.price);
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  await Product.update(
    {
      title: updatedTitle,
      price: updatedPrice,
      imageUrl: updatedImageUrl,
      description: updatedDescription,
    },
    {
      where: {
        id: prodId,
      },
    }
  )
    .then(() => {
      // console.log("result", result);
      return res.redirect("/");
    })
    .catch((err) => {
      console.log("error", err);
    });
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  await Product.destroy({
    where: {
      id: productId,
    },
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getProducts = async (req, res, next) => {
  await req.user
    .getProducts()
    .then((result) => {
      res.render("admin/products", {
        prods: result,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProduct: result.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log("err", err));
};

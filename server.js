// imports
const path = require("path");

// server config
const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.static("public"));

// format config
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API router config
const routerProducts = express.Router();
app.use("/api/productos", routerProducts);

// pug config
//const handlebars = require("express-handlebars");
//app.engine("handlebars", handlebars.engine({ defaultLayout: "index" }));
const views = path.join(__dirname, "views");
app.set("views", views);
app.set("view engine", "pug");

// server listening
const server = app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`); // server listening message.
});
server.on("error", (error) => console.log(`error at server ${PORT}`)); // catch server error.

// container config.
const Container = require("./classContainer");
let products = new Container();

// VIEWS routes.
// form view.
app.get("/", (req, res) => {
  res.render("formProducts");
});

//products view.
app.get("/productos", (req, res) => {
  products.getAll().length === 0
    ? res.render("emptyProducts", { message: "No se encontraron productos." })
    : res.render("viewProducts", {
        products: products.getAll(),
      });
});

//API routes.
// show all products.
routerProducts.get("/", (req, res) => {
  products.getAll().length === 0
    ? res.json({ message: "empty products array!" })
    : res.send(products.getAll());
});

// show a product by id.
routerProducts.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productById = products.getById(id);
  if (productById.length === 0) {
    res.json({
      message: "error: product not found.",
    });
  } else
    res.json({
      product: productById,
    });
});

// save a product in array of products.
routerProducts.post("/", (req, res) => {
  const product = req.body;
  if (product.title && product.price && product.thumbnail) {
    products.save(product);
    res.redirect("/");
  } else {
    res.json({
      message: "error: empty or incorrect entries.",
    });
  }
});

// update a product in array of products by id.
routerProducts.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let product = req.body;
  if (products.getById(id).length === 0) {
    res.json({
      message:
        "error: the product could not be updated because it does not exist.",
    });
  } else {
    if (product.title && product.price && product.thumbnail) {
      products.deleteById(id);
      products.update(product, id);
      res.json({
        message: "product updated successfully!",
      });
    } else {
      res.json({
        message: "error: empty or incorrect entries.",
      });
    }
  }
});

// delete a product in array of products by id.
routerProducts.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.getById(id);
  if (product.length === 0) {
    res.json({
      message:
        "error: the product could not be removed because it does not exist.",
    });
  } else {
    products.deleteById(id);
    res.json({
      message: "product removed successfully!",
    });
  }
});

// invalid paths.
app.get("*", (req, res) => res.json({ message: "error: invalid path" }));

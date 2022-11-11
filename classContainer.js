class Container {
  static arrayOfProducts = []; // array of products.
  static countId = 0; // id counter for products id's.

  constructor() {}

  save(product) {
    try {
      Container.countId++;
      Container.arrayOfProducts.push({ id: Container.countId, ...product });
    } catch {
      return Error("error in function: save.");
    }
  }

  getAll() {
    try {
      return Container.arrayOfProducts;
    } catch (error) {
      return Error("error in function: get all.");
    }
  }

  getById(id) {
    try {
      const product = Container.arrayOfProducts.filter((x) => x.id === id);
      return product;
    } catch {
      return Error("error in function: get by id.");
    }
  }

  deleteById(id) {
    try {
      const newProducts = Container.arrayOfProducts.filter((x) => x.id != id);
      Container.arrayOfProducts = newProducts;
    } catch {
      return Error("error in function: delete by id.");
    }
  }

  update(product, id) {
    try {
      Container.arrayOfProducts.push({ id: id, ...product });
    } catch {
      return Error("error in function: update.");
    }
  }
}

module.exports = Container;

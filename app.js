// shopping cart
let cart = [];

// get information from json
class Product {
  async getProduct() {
    try {
      const result = await fetch("./products.json");
      const data = await result.json();
      let products = data.items;

      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (err) {
      console.log(err);
    }
  }
}

// view information from product
class View {}

// save product
class Storage {}

//loading
document.addEventListener("DOMContentLoaded", () => {
  //creat new View
  const view = new View();
  //create new product
  const product = new Product();

  product.getProduct().then((data) => console.log(data));
});

const productsDOM = document.querySelector(".products-center");

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
class View {
  displayProducts(products) {
    let result = "";

    products.forEach((item) => {
      result += `
      <article class="product">
  <div class="img-container">
    <img src="${item.image}" alt="${item.title}" class="product-img" />
    <button class="bag-btn" data-id="${item.id}">افزودن به سبد خرید</button>
  </div>
  <h3>${item.title}</h3>
  <h4>${item.price}</h4>
</article>
      
      `;
    });
    productsDOM.innerHTML = result;
  }

  getCardButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];

    buttons.forEach((item) => {
      let id = item.dataset.id;

      item.addEventListener("click", (event) => {
        let cartItem = Storage.getProduct(id);
        cart = [...cart, cartItem];
      });
    });
  }
}

// save product
class Storage {
  static saveProduct(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let productsList = JSON.parse(localStorage.getItem("products"));

    return productsList.find((item) => item.id === id);
  }
}

//loading
document.addEventListener("DOMContentLoaded", () => {
  //creat new View
  const view = new View();
  //create new product
  const product = new Product();

  product
    .getProduct()
    .then((data) => {
      view.displayProducts(data);
      Storage.saveProduct(data);
    })
    .then(() => {
      view.getCardButtons();
    });
});

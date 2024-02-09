const productsDOM = document.querySelector(".products-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");

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
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let totlaPrice = 0;
    let totlaItems = 0;

    cart.map((item) => {
      totlaPrice = totlaPrice + item.price * item.amount;
      totlaItems = totlaItems + item.amount;
    });
    cartTotal.innerHTML = totlaPrice;
    cartItems.innerText = totlaItems;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src=${item.image} alt=${item.title} />
      <div>
        <h4>${item.title}</h4>
        <h5>${item.price}</h5>
        <span class="remove-item">حذف</span>
      </div>
      <div>
        <i class="fas fa-chevron-up"></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down"></i>
      </div>
    `;

    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  initApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
  }

  populate(cart) {
    cart.forEach((item) => {
      return this.addCartItem(item);
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

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

//loading
document.addEventListener("DOMContentLoaded", () => {
  //creat new View
  const view = new View();
  //create new product
  const product = new Product();

  view.initApp();

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

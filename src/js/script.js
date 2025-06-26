const productListElement = document.querySelector(".product-list__grid")
const productList = []

const productCartElement = document.querySelector(".shopping-cart__products")
const emptyCartElement = document.querySelector(".empty-cart")
const activeCartElement = document.querySelector(".active-cart")
const productCart = []


fetch("../../data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('data.json loading error');
    }
    return response.json();
  })
  .then(products => {
    products.forEach((product, index) => {
      productList[index] = {...product, id: index}
      const cardElement = document.createElement('li');
      cardElement.classList.add('product-list__item');

      cardElement.innerHTML = `
        <article class="product-list__card">
            <div class="product-list__wrapper">
                <picture >
                  <source media="(min-width: 1300px)" srcset="${product.image.desktop}">
                  <source media="(min-width: 525px)" srcset="${product.image.tablet}">
                  <img class="product-list__item-image" src="${product.image.mobile}" alt="" height="240">
                </picture>
                <button type="button" class="add-to-cart-button text--preset-4--bold">
                  <img src="assets/images/icon-add-to-cart.svg" alt="" width="20" height="20">
                  Add to Cart
                </button>
                <div class="product-list__item-quantity-controller" style="display: none;">
                  <button class="product-list__item-minus">
                    <img src="assets/images/icon-decrement-quantity.svg"alt="" class="icon-decrement">
                  </button>
                  <span class="product-list__item-quantity" text--preset-4--bold>1</span>
                  <button class="product-list__item-plus">
                    <img src="assets/images/icon-increment-quantity.svg" alt="" class="icon-increment">
                  </button>
                </div>
            </div>
            <div class="product-list__item-info">
                <span class="product-list__item-category text--preset-4">${product.category}</span>
                <h3 class="product-list__item-name text--preset-3">${product.name}</h3>
                <span class="product-list__item-price text--preset-3">$${product.price.toFixed(2)}</span>
            </div>
        </article>
      `;

      productListElement.appendChild(cardElement);
    });

    setupCartButtons()
})


function setupCartButtons(){
  const addToCartButtonElements = productListElement.querySelectorAll(".add-to-cart-button")
  const plusButtonElements = productListElement.querySelectorAll(".product-list__item-plus")
  const minusButtonElements = productListElement.querySelectorAll(".product-list__item-minus")

  addToCartButtonElements.forEach((button, index) => {
    button.addEventListener("click", () => {
      addToCart(index)
    });
  });

  plusButtonElements.forEach((plusButton, index) =>{
    plusButton.addEventListener("click", () => {
        addToCart(index)
    });
  })

  minusButtonElements.forEach((minusButton, index) =>{
    minusButton.addEventListener("click", () => {
        removeFromCart(index)
    });
  })
}


function addToCart(index){
  const existingProduct = productCart.find((product) => product.id === index);

  if (existingProduct) {
    existingProduct.quantity++;
  }
  else{
    productCart.push({...productList[index], quantity: 1,})
  }
  
  updateUI();
}

function removeFromCart(index){
  const existingProduct = productCart.find((product) => product.id === index);
  existingProduct.quantity--
  if(existingProduct.quantity === 0) clearCart(index)
  updateUI();
}


function clearCart(index){
  productCart.splice(productCart.findIndex(product => product.id === index), 1)
  updateUI();
}


function updateUI(){
  updateCart()
  updateButtons()
}


function updateCart(){
  let totalPrice = 0
  let totalQuantity = 0

  if (productCart.length > 0) {
    emptyCartElement.style.display = "none"
    activeCartElement.style.display = "flex"
  }
  else{
    emptyCartElement.style.display = "flex"
    activeCartElement.style.display = "none"
  }

  productCartElement.innerHTML = ""
  productCart.forEach((product) => {
    let quantity = product.quantity
    if (quantity > 0){
      let name = product.name
      let price = product.price
      let subtotal = price * quantity
      totalPrice += subtotal
      totalQuantity += quantity
      productCartElement.innerHTML += `
      <article class="cart-item shopping-cart-item">
        <div class="cart-item__info">
          <h4 class="cart-item__name text--preset-4--bold">${name}</h4>
          <div class="cart-item__quantity-and-price">
            <span class="cart-item__quantity text--preset-4--bold">${quantity}x</span>
            <span class="cart-item__price text--preset-4">@ $${price.toFixed(2)}</span>
            <span class="cart-item__subtotal text--preset-4--bold">$${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <button class="cart-item__clear-cart-button" onclick="clearCart(${product.id})">
          <img src="assets/images/icon-remove-item.svg" alt="">
        </button>
      </article>
      <hr class="shopping-cart__separator">
      `
    }
  })

  const shoppingCartTitleElement = productCartElement.parentElement.querySelector(".shopping-cart__title")
  shoppingCartTitleElement.textContent = `Your Cart (${totalQuantity})`

  const shoppingCartTotalPrice = activeCartElement.querySelector(".active-cart__total-price")
  shoppingCartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`
}


function updateButtons() {
  const addToCartButtonElements = productListElement.querySelectorAll(".add-to-cart-button");
  const quantityControllerElements = productListElement.querySelectorAll(".product-list__item-quantity-controller");
  const quantityTextElements = productListElement.querySelectorAll(".product-list__item-quantity");

  addToCartButtonElements.forEach((button, index) => {
    const productInCart = productCart.find(p => p.id === index);

    if (!productInCart || productInCart.quantity < 1) {
      button.style.display = 'flex';
      quantityControllerElements[index].style.display = 'none';
    } else {
      button.style.display = 'none';
      quantityControllerElements[index].style.display = 'flex';
      quantityTextElements[index].textContent = productInCart.quantity;
    }
  });
}

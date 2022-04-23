if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");

  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  // document
  //   .getElementsByClassName("btn-purchase")[0]
  //   .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Thank you for your purchase");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  // while (cartItems.hasChildNodes()) {
  //   cartItems.removeChild(cartItems.firstChild);
  // }
  updateCartTotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  // buttonClicked.parentElement.parentElement.parentElement.parentElement.remove();
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  var quantity = shopItem.getElementsByClassName("shop-item-quantity")[0].value;
  addItemToCart(title, price, imageSrc, quantity);
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc, quantity) {
  var cartRow = document.createElement("tr");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  var cartRowContents = `
    <tr class="cart-row">
    <td>
      <div class="cart-info">
        <img src="${imageSrc}">
        <div>
          <p class="p-ti cart-item-title">${title}</p>
          <button class="btn-danger">remove</button> 
        </div>
      </div>
    </td>
    <td><input class="cart-quantity-input" type="number" value="${quantity}"></td>
    <td class="cart-price">${price}</td>
    </tr>
        `;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  console.log(cartItemContainer);
  console.log(cartRows);
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    console.log("1001");
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}

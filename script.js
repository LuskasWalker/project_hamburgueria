const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const time = document.getElementById("time-warn");

let cart = [];

function parsePrice(rawPrice) {
  return Number.parseFloat(String(rawPrice).replace(",", "."));
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parsePrice(parentButton.getAttribute("data-price"));

    if (Number.isNaN(price)) {
      return;
    }

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const hasItem = cart.find((item) => item.name === name);
  if (hasItem) {
    hasItem.qtd += 1;
  } else {
    cart.push({
      name,
      price,
      qtd: 1,
    });
  }
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.qtd}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
        <button class="remove-cart-btn" data-name="${item.name}">
          Remover
        </button>

      </div>`;

    total += item.price * item.qtd;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = formatCurrency(total);

  const totalItems = cart.reduce((acc, item) => acc + item.qtd, 0);
  cartCounter.textContent = totalItems;
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.qtd > 1) {
      item.qtd -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  const inputValue = event.target.value.trim();
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    return;
  }

  if (cart.length === 0) return;
  const address = addressInput.value.trim();

  if (address === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItem = cart.map((item) => `${item.qtd}x ${item.name}`).join("\n");

  const totalPrice = cart.reduce((acc, item) => acc + item.qtd * item.price, 0);
  const message = encodeURIComponent(
    `${cartItem}\nTotal: ${formatCurrency(totalPrice)}\nEndereço: ${address}`
  );
  const phone = "5549989128778";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
  addressInput.value = "";
  cartModal.style.display = "none";
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("status-closed");
  spanItem.classList.add("status-open");
  time.classList.add("hidden");
} else {
  spanItem.classList.remove("status-open");
  spanItem.classList.add("status-closed");
  time.classList.remove("hidden");
  checkoutBtn.classList.remove("bg-green-600", "hover:bg-green-700");
  checkoutBtn.classList.add("bg-red-600", "hover:bg-red-700");
}

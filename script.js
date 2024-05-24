"use strict";

let walletAmount = 50;

let items = [
    { name: 'Apple', price: 1.99 },
    { name: 'Banana', price: 0.99 },
    { name: 'Orange', price: 2.49 },
    { name: 'Strawberry', price: 3.12 },
    { name: 'IPhone', price: 1299.99 },
    { name: 'Deodorans', price: 3.29 },
    { name: 'Cigarettes', price: 4.80 },
    { name: 'Chewing-gum', price: 0.89},
    { name: 'Chocolate bar', price: 2.50 },
    { name: 'Coffee', price: 5.00 },
    { name: 'Bottled water', price: 1.20 },
    { name: 'Soda', price: 1.50 }
   
];

let cart = [];
let cartCount = document.getElementById("cartCount");
let cartItems = document.getElementById("cartItems");
let cartTotal = document.getElementById("cartTotal");
let modal = document.getElementById("myModal");
let closeBtn = document.getElementById("closeModal");
let buyBtn = document.getElementById("buyButton");
let walletDisplay = document.getElementById("walletAmount");
let messageDisplay = document.getElementById("message");
let filterMinPriceInput = document.getElementById("filterMinPrice");
let filterMaxPriceInput = document.getElementById("filterMaxPrice");
let filterButton = document.getElementById("filterButton");

function updateWalletDisplay() {
    walletDisplay.textContent = walletAmount.toFixed(2);
}

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItems.innerHTML = "";
    let cartMap = new Map();
    cart.forEach((item) => {
        if (cartMap.has(item.name)) {
            cartMap.set(item.name, cartMap.get(item.name) + 1);
        } else {
            cartMap.set(item.name, 1);
        }
    });
    cartMap.forEach((value, key) => {
        let li = document.createElement("li");
        li.textContent = `${key} x${value}`;
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove all.";
        removeButton.addEventListener("click", () => removeFromCart(key, items.length));
        li.appendChild(removeButton);
        let removeOneButton = document.createElement("button");
        removeOneButton.textContent = "Remove One";
        removeOneButton.addEventListener("click", () => removeFromCart(key, 1));
        li.appendChild(removeOneButton);
        cartItems.appendChild(li);
    });
    cartTotal.textContent = `$${calculateCartAmount().toFixed(2)}`;
}

function showMessage(message) {
    messageDisplay.textContent = message;
    setTimeout(() => {
        messageDisplay.textContent = "";
    }, 3000);
}

function calculateCartAmount() {
    return cart.reduce((acc, item) => acc + item.price, 0);
}

function showItems() {
    let itemsGrid = document.getElementById("itemsGrid");
    itemsGrid.innerHTML = "";
    items.forEach((item) => {
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = `images/${item.name.toLowerCase()}.jpg`; 
        img.style.width = "100px"; 
        img.style.height = "100px";
        button.appendChild(img);
        button.innerHTML += `<br> Buy ${item.name} - $${item.price.toFixed(2)}`;
        button.addEventListener("click", () => buy(item.name, 1));
        itemsGrid.appendChild(button);
    });
}

function buy(itemName, quantity) {
    const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
    if (!item) {
        showMessage("Item not found.");
        return;
    }

    for (let i = 0; i < quantity; i++) {
        cart.push(item);
    }
    updateCartUI();
}

function removeFromCart(itemName, quantity) {
    const index = cart.findIndex((item) => item.name.toLowerCase() === itemName.toLowerCase());
    if (index === -1) {
        showMessage("Item not found in cart.");
        return;
    }
    const itemInstances = cart.filter((item) => item.name.toLowerCase() === itemName.toLowerCase());
    const itemsToRemove = Math.min(itemInstances.length, quantity);
    if (itemsToRemove === 0) {
        showMessage(`There are no ${itemName}(s) in the cart to remove.`);
        return;
    }
    for (let i = 0; i < itemsToRemove; i++) {
        cart.splice(index, 1);
    }
    showMessage(`Removed ${itemsToRemove} ${itemName}(s) from cart.`);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        showMessage("Your cart is empty.");
        return;
    }
    const cartAmount = calculateCartAmount();
    if (cartAmount > walletAmount) {
        showMessage("Not enough money in the wallet to checkout. Please remove some items or add funds to your wallet.");
        return;
    }
    walletAmount -= cartAmount;
    showMessage("Checkout successful. Thank you for your purchase!");
    cart = [];
    updateWalletDisplay();
    updateCartUI();
}

function checkWallet() {
    showMessage(`Wallet balance: $${walletAmount}`);
}

function filterItems() {
    let minPrice = parseFloat(filterMinPriceInput.value);
    let maxPrice = parseFloat(filterMaxPriceInput.value);

    let filteredItems;

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filteredItems = items.filter(item => item.price >= minPrice && item.price <= maxPrice);
    } else {
        filteredItems = items;
    }

    let itemsGrid = document.getElementById("itemsGrid");
    itemsGrid.innerHTML = "";

    filteredItems.forEach((item) => {
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = `${item.name.toLowerCase()}.jpg`; 
        img.style.width = "100px"; 
        img.style.height = "100px";
        button.appendChild(img);
        button.innerHTML += `<br> Buy ${item.name} - $${item.price.toFixed(2)}`;
        button.addEventListener("click", () => buy(item.name, 1));
        itemsGrid.appendChild(button);
    });
}



document.getElementById("cartButton").addEventListener("click", () => {
    modal.style.display = "block";
});

closeBtn.onclick = function () {
    modal.style.display = "none";
};

buyBtn.onclick = function () {
    checkout();
    modal.style.display = "none";
};

filterButton.onclick = function () {
    filterItems();
};

showItems();
updateCartUI();
updateWalletDisplay();

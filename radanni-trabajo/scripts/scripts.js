function on() {
    const turnOn = document.getElementById("overlay");
    turnOn.style.display = "block";
    const overflow = document.querySelector("body");
    overflow.style.overflow = "hidden";
}

function off() {
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = "none";
    const overflow = document.querySelector("body");
    overflow.style.overflow = "";
}

// Carrito global (cargado desde localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Inicializar botones de cada pizza
document.querySelectorAll(".pizza-child").forEach((pizza) => {
    const addToCartBtn = pizza.querySelector(".add-to-cart");
    const addSelected = pizza.querySelector(".add-selected");
    const minusBtn = addSelected.querySelector("button:first-child");
    const plusBtn = addSelected.querySelector("button:last-child");
    const quantityText = addSelected.querySelector("h4");

    let quantity = 0;
    const itemName = pizza.querySelector("h4").innerText.split("$")[0].trim();
    const itemPrice = parseInt(pizza.querySelector("h4").innerText.split("$")[1].replace(/\./g, "").trim());

    // Si ya estaba en el carrito, restaurar estado
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        quantity = existingItem.quantity;
        addToCartBtn.style.display = "none";
        addSelected.style.display = "flex";
        quantityText.innerText = quantity;
    }

    // Al hacer clic en "Añadir al carro"
    addToCartBtn.addEventListener("click", () => {
        addToCartBtn.style.display = "none";
        addSelected.style.display = "flex";
        quantity = 1;
        quantityText.innerText = quantity;

        addItemToCart(itemName, itemPrice, quantity);
        alert(`${itemName} ha sido añadido al carrito.`);
    });

    // Botón +
    plusBtn.addEventListener("click", () => {
        quantity++;
        quantityText.innerText = quantity;
        updateItemQuantity(itemName, quantity);
    });

    // Botón -
    minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantityText.innerText = quantity;
            updateItemQuantity(itemName, quantity);
        } else {
            // eliminar si llega a 0
            quantity = 0;
            quantityText.innerText = quantity;
            addSelected.style.display = "none";
            addToCartBtn.style.display = "block";
            removeItemFromCart(itemName);
        }
    });
});

// Función para añadir producto al carrito
function addItemToCart(name, price, quantity) {
    const existingItemIndex = cart.findIndex(item => item.name === name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = quantity;
    } else {
        cart.push({ name, price, quantity });
    }
    saveCart();
    renderCart();
}

// Actualizar cantidad
function updateItemQuantity(name, quantity) {
    cart = cart.map(item =>
        item.name === name ? { ...item, quantity } : item
    );
    saveCart();
    renderCart();
}

// Eliminar producto
function removeItemFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Renderizar carrito en el DOM
function renderCart() {
    let cartContainer = document.getElementById("cart");
    if (!cartContainer) return;

    cartContainer.innerHTML = "<h2>🛒 Carrito</h2>";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML += "<p>Aún no has agregado productos.</p>";
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            let div = document.createElement("div");
            div.innerText = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString("es-CL")}`;
            cartContainer.appendChild(div);
        });
    
        let totalDiv = document.createElement("h3");
        totalDiv.innerText = `Total: $${total.toLocaleString("es-CL")}`;
        cartContainer.appendChild(totalDiv);
    }
}

// Redirigir a order.html al hacer clic en "Finalizar compra"
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío. Agrega productos antes de continuar.");
            } else {
                saveCart();
                window.location.href = "order.html";
            }
        });
    }

    renderCart();
});
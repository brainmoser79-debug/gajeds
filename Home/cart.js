let cartBox = document.querySelector("#cartBox");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let savedCartBackup = [];
let undoTimeout = null;
let countdownInterval = null;

function renderCart() {
    let totalCount = document.querySelector("#totalCount");
    let totalPrice = document.querySelector("#totalPrice");
    let checkoutBtn = document.querySelector("#checkoutBtn");

    if (cart.length === 0) {
        cartBox.innerHTML = "<h2 class='text-purple-300/50 text-base my-4'>Ваша корзина пуста</h2>";
        totalCount.innerText = "0 шт.";
        totalPrice.innerText = "$0";
        checkoutBtn.style.display = "none";
        return;
    }

    checkoutBtn.style.display = "block";
    let sum = 0;

    let html = cart.map((item, index) => {
        sum += Number(item.price);
        return `
        <div class="glass-card rounded-2xl p-4 w-[270px] flex flex-col justify-between transition duration-300 relative group overflow-hidden border border-purple-500/20">
            <div>
                <div class="w-full h-40 bg-black/40 rounded-xl overflow-hidden mb-3 border border-purple-500/10 relative">
                    <img src="${item.image}" alt="${item.product}" class="w-full h-full object-cover opacity-90">
                    <button onclick="toggleFavorite(${index})" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-pink-500 hover:scale-110 transition border border-pink-500/30">
                        ❤️
                    </button>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">${item.category}</span>
                <h3 class="font-bold text-base text-white mt-3 mb-2">${item.product}</h3>
                <p class="text-xs text-purple-200/60 mb-1">Бренд: <span class="text-purple-100">${item.brand}</span></p>
            </div>
            <div class="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between">
                <span class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">$${item.price}</span>
                <button onclick="removeItem(${index})" class="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 flex items-center justify-center text-red-300 transition">
                    🗑️
                </button>
            </div>
        </div>`;
    }).join("");
    
    cartBox.innerHTML = html;
    totalCount.innerText = cart.length + " шт.";
    totalPrice.innerText = "$" + sum;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function toggleFavorite(index) {
    alert(`Товар "${cart[index].product}" добавлен в избранное!`);
}

function clearCart() {
    if (cart.length === 0) return;

    savedCartBackup = [...cart];
    cart = [];
    localStorage.removeItem("cart");
    renderCart();

    let notification = document.querySelector("#undoNotification");
    let countdownTimer = document.querySelector("#countdownTimer");
    notification.classList.remove("hidden");

    let timeLeft = 5;
    countdownTimer.innerText = timeLeft;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownTimer.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => {
        notification.classList.add("hidden");
        savedCartBackup = [];
    }, 5000);
}

function undoClearCart() {
    if (savedCartBackup.length > 0) {
        cart = [...savedCartBackup];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    let notification = document.querySelector("#undoNotification");
    notification.classList.add("hidden");
    clearTimeout(undoTimeout);
    clearInterval(countdownInterval);
}

function openCheckoutModal() {
    if (cart.length === 0) return;
    document.querySelector("#checkoutModal").style.display = "flex";
}

function closeCheckoutModal() {
    document.querySelector("#checkoutModal").style.display = "none";
}

function processPayment() {
    let name = document.querySelector("#buyerName").value.trim();
    if (!name) {
        alert("Пожалуйста, введите ваше имя!");
        return;
    }

    alert(`Поздравляем, ${name}! Оплата прошла успешно. Ваш заказ начал собираться с космической скоростью! 🚀`);
    
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    closeCheckoutModal();
}

renderCart();
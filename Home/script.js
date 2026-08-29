const initialProducts = [
    { 
        id: 1, 
        product: "Redmi Note 11 Pro", 
        price: 800, 
        category: "Смартфоны", 
        color: "Black", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLv16zPO0modFuukkO4CC065enG9qg1H4G1Mzsx47NHA&s=10" 
    },
    { 
        id: 2, 
        product: "Samsung Galaxy S22", 
        price: 999, 
        category: "Смартфоны", 
        color: "Blue", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTMSDXRDOxmaA6NZRuAg9-Bbp_IyicF8ofQMd6WOWNvw&s=10" 
    },
    { 
        id: 3, 
        product: "iPhone 14 Pro", 
        price: 1200, 
        category: "Смартфоны", 
        color: "Silver", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrqoRr3fruCw2C9GF-Ma-6f86fNubaGznfeAN55m0Low&s=10" 
    },
    { 
        id: 4, 
        product: "MacBook Air M1", 
        price: 1200, 
        category: "Ноутбуки", 
        color: "Silver", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrqoRr3fruCw2C9GF-Ma-6f86fNubaGznfeAN55m0Low&s=10" 
    },
    { 
        id: 5, 
        product: "Samsung Galaxy Tab S7", 
        price: 600, 
        category: "Планшеты", 
        color: "Black", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLv16zPO0modFuukkO4CC065enG9qg1H4G1Mzsx47NHA&s=10" 
    }
];  
const box = document.querySelector(".box");
let allProducts = []; 
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function updateCounters() {
    let cartCountEl = document.querySelector("#cartCount");
    let favCountEl = document.querySelector("#favCount");
    if(cartCountEl) cartCountEl.innerText = cart.length;
    if(favCountEl) favCountEl.innerText = favorites.length;
}

function fetchData() {
    // Сбрасываем старый "битый" кэш в localStorage, чтобы применились новые картинки
    const isUpdated = localStorage.getItem("images_fixed_v2");
    if (!isUpdated) {
        localStorage.removeItem("allProducts");
        localStorage.setItem("images_fixed_v2", "true");
    }

    const storedProducts = localStorage.getItem("allProducts");
    if (storedProducts) {
        allProducts = JSON.parse(storedProducts);
    } else {
        allProducts = [...initialProducts];
        localStorage.setItem("allProducts", JSON.stringify(allProducts));
    }
    render(allProducts);
}

function addProduct() {
    const nameInp = document.getElementById("pName");
    const priceInp = document.getElementById("pPrice");
    const categoryInp = document.getElementById("pCategory");
    const imgInp = document.getElementById("pImg");

    if(!nameInp.value || !priceInp.value) return alert("Пожалуйста, введите название и цену!");

    const newObj = {
        id: Date.now(), 
        product: nameInp.value,
        price: Number(priceInp.value),
        category: categoryInp.value,
        color: "Black",
        image: imgInp.value || `https://picsum.photos/seed/${Date.now()}/500/500` 
    };

    allProducts.push(newObj);
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    render(allProducts);
    
    nameInp.value = ""; 
    priceInp.value = ""; 
    if(imgInp) imgInp.value = "";
}

function updateProduct(id) {
    const newPrice = prompt("Введите новую цену:");
    if (newPrice && !isNaN(newPrice)) {
        allProducts = allProducts.map(p => 
            p.id === id ? { ...p, price: Number(newPrice) } : p
        );
        localStorage.setItem("allProducts", JSON.stringify(allProducts));
        render(allProducts);
    }
}

function deleteProduct(id) {
    if(confirm("Вы действительно хотите удалить этот товар?")) {
        allProducts = allProducts.filter(p => p.id !== id);
        localStorage.setItem("allProducts", JSON.stringify(allProducts));
        render(allProducts);
    }
}

function toggleFavorite(id) {
    let item = allProducts.find(p => p.id === id);
    let index = favorites.findIndex(f => f.id === id);
    if (index === -1) {
        favorites.push(item);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    render(allProducts);
}

function addCart(id) {
    let item = allProducts.find(p => p.id === id);
    let isExist = cart.some(p => p.id === id);
    
    if (!isExist) {
        let modal = document.querySelector("#loadingModal");
        let spinner = document.querySelector("#spinnerBox");
        let success = document.querySelector("#successBox");

        modal.classList.remove("hidden");
        spinner.classList.remove("hidden");
        success.classList.add("hidden");

        setTimeout(() => {
            spinner.classList.add("hidden");
            success.classList.remove("hidden");

            cart.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCounters();

            setTimeout(() => {
                modal.classList.add("hidden");
            }, 800);
        }, 1000);
    } else {
        alert("Этот товар уже находится в корзине!");
    }
}

function render(data) {
    if (!box) return;
    updateCounters();
    
    box.innerHTML = data.map(e => {
        let isFav = favorites.some(f => f.id === e.id);
        return `
        <div class="glass-card rounded-2xl p-4 w-[270px] flex flex-col justify-between transition duration-300 relative group overflow-hidden">
            <div>
                <div class="w-full h-40 bg-black/40 rounded-xl overflow-hidden mb-3 border border-purple-500/10 relative">
                    <img src="${e.image}" alt="${e.product}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-95" 
                         onerror="this.src='https://placehold.jp/300x300.png'">
                    <button onclick="toggleFavorite(${e.id})" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border transition ${isFav ? 'border-pink-500 bg-pink-500/20' : 'border-white/20 hover:border-pink-500'}">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">${e.category}</span>
                <h3 class="font-bold text-base text-white mt-3 mb-2">${e.product}</h3>
            </div>
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">$${e.price}</span>
                </div>
                <div class="flex items-center gap-2 pt-2 border-t border-purple-500/25">
                    <button onclick="addCart(${e.id})" class="neon-btn text-white text-xs font-bold uppercase px-3 py-2 rounded-lg transition flex-1">🛒 В корзину</button>
                    <button onclick="updateProduct(${e.id})" class="px-3 py-2 bg-white/5 hover:bg-white/10 text-purple-300 text-xs rounded-lg transition border border-white/10" title="Редактировать">✏️</button>
                    <button onclick="deleteProduct(${e.id})" class="px-3 py-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 text-xs rounded-lg transition border border-red-500/25" title="Удалить">🗑</button>
                </div>
            </div>
        </div>
    `;
    }).join("");
}

document.querySelector(".btn1")?.addEventListener("click", () => render(allProducts.filter(p => p.category === "Смартфоны")));
document.querySelector(".btn2")?.addEventListener("click", () => render(allProducts.filter(p => p.category === "Планшеты")));
document.querySelector(".btn3")?.addEventListener("click", () => render(allProducts.filter(p => p.category === "Ноутбуки")));
document.querySelector(".sortOrg")?.addEventListener("click", () => render(allProducts));

document.querySelector(".sortUp")?.addEventListener("click", () => {
    render([...allProducts].sort((a,b) => a.price - b.price));
});
document.querySelector(".sortDown")?.addEventListener("click", () => {
    render([...allProducts].sort((a,b) => b.price - a.price));
});
fetchData();
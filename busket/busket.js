 let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let favBox = document.querySelector("#favBox");

        function updateCounters() {
            document.querySelector("#cartCount").innerText = cart.length;
        }

        function renderFavorites() {
            updateCounters();
            if (favorites.length === 0) {
                favBox.innerHTML = `<p class="text-purple-300/60 text-sm">В избранном пока ничего нет 💔</p>`;
                return;
            }

            let html = favorites.map((e) => {
                return `
                <div class="glass-card rounded-2xl p-4 w-[270px] flex flex-col justify-between transition duration-300 relative group overflow-hidden">
                    <div>
                        <div class="w-full h-40 bg-black/40 rounded-xl overflow-hidden mb-3 border border-purple-500/10 relative">
                            <img src="${e.image}" alt="${e.product}" class="w-full h-full object-cover opacity-90">
                            <button onclick="removeFav(${e.id})" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-pink-500 bg-pink-500/20 text-xs">
                                ❌
                            </button>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">${e.category}</span>
                        <h3 class="font-bold text-base text-white mt-3 mb-2">${e.product}</h3>
                    </div>
                    <div class="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between gap-2">
                        <span class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">$${e.price}</span>
                        <button onclick="addCartFromFav(${e.id})" class="neon-btn text-white text-xs font-bold uppercase px-3 py-2 rounded-lg transition">В корзину</button>
                    </div>
                </div>`;
            }).join("");

            favBox.innerHTML = html;
        }

        function removeFav(id) {
            favorites = favorites.filter(f => f.id !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavorites();
        }

        function addCartFromFav(id) {
            let item = favorites.find(e => e.id === id);
            let isExist = cart.some(e => e.id === id);
            if (!isExist) {
                cart.push(item);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCounters();
                alert("Товар добавлен в корзину!");
            } else {
                alert("Товар уже в корзине.");
            }
        }

        renderFavorites();
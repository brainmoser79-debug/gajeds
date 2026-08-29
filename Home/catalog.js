   let cartBox = document.querySelector("#cartBox");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart() {
            if (cart.length === 0) {
                cartBox.innerHTML = "<h2 class='text-purple-300/50 text-lg my-12'>Savatchangiz bo'sh</h2>";
                return;
            }

            let html = cart.map((item, index) => {
                return `
                <div class="glass-card rounded-2xl p-4 w-[270px] flex flex-col justify-between transition duration-300 relative group overflow-hidden border border-purple-500/20">
                    <div>
                        <div class="w-full h-40 bg-black/40 rounded-xl overflow-hidden mb-3 border border-purple-500/10">
                            <img src="${item.image}" alt="${item.product}" class="w-full h-full object-cover opacity-90">
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">${item.category}</span>
                        <h3 class="font-bold text-base text-white mt-3 mb-2">${item.product}</h3>
                        <p class="text-xs text-purple-200/60 mb-1">Brand: <span class="text-purple-100">${item.brand}</span></p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between">
                        <span class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">$${item.price}</span>
                        <button onclick="removeItem(${index})" class="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 text-xs font-bold uppercase px-3 py-2 rounded-lg transition">O'chirish</button>
                    </div>
                </div>`;
            }).join("");
            
            cartBox.innerHTML = html;
        }

        function removeItem(index) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }

        function clearCart() {
            localStorage.removeItem("cart");
            cart = [];
            renderCart();
            alert("Savat tozalandi!");
        }

        renderCart();
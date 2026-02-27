
    const products = [
        {name:"Jordan 1 Low", price:6999, img:"ShoesImage/Jordan1.webp", desc:"Classic street sneaker.", category:"New Drops", onSale:false},
        {name:"Jordan 2 Retro", price:9499, img:"ShoesImage/Jordan2.jpg", desc:"Comfortable running shoe.", category:"Mens", onSale:true},
        {name:"Jordan 3 Retro", price:9999, img:"ShoesImage/Jordan3.jpg", desc:"Iconic basketball sneaker.", category:"Womens", onSale:false},
        {name:"Jordan 4 Retro", price:12499, img:"ShoesImage/Jordan4Snorlax.webp", desc:"Bold modern sneaker.", category:"Mens", onSale:false},
        {name:"Jordan 4 RM", price:5499, img:"ShoesImage/Jordan4RM.jpg", desc:"Lightweight running sneaker.", category:"Mens", onSale:false},
        {name:"Jordan Flight Court", price:3499, img:"ShoesImage/JordanF.jpg", desc:"Stylish Retro.", category:"Kids", onSale:true}
    ];

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.map(i => parseInt(i));

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function populateProducts(category){
        const grid = document.getElementById("product-grid");
        if(!grid) return;

        let filtered = category === "Sale" ? products.filter(p => p.onSale) : products.filter(p => p.category === category);
        grid.innerHTML = "";
        filtered.forEach(product => {
            const idx = products.indexOf(product);
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <a href="Product.html?index=${idx}">
                    <img src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="category">${product.category}</div>
                    <div class="price">₱${product.price}</div>
                </a>
            `;
            grid.appendChild(card);
        });
    }

    function populatePreview(){
        const urlParams = new URLSearchParams(window.location.search);
        const index = parseInt(urlParams.get('index'));
        if(isNaN(index) || !products[index]) return;

        const product = products[index];

        const imgEl = document.querySelector('.preview-image img');
        if(imgEl) { imgEl.src = product.img; imgEl.alt = product.name; }

        document.querySelector('.preview-details h1').textContent = product.name;
        document.querySelector('.preview-details h2').textContent = "₱" + product.price;
        document.querySelector('.preview-details .description').textContent = product.desc;

        const backBtn = document.getElementById('back-btn');
        if(backBtn){
            backBtn.addEventListener('click', () => { window.history.back(); });
        }

        const favoriteBtn = document.getElementById("favorite-btn");
        if(favoriteBtn){
            if(favorites.includes(index)) favoriteBtn.classList.add("active");
            favoriteBtn.addEventListener("click", () => {
                if(favorites.includes(index)){
                    favorites = favorites.filter(i => i !== index);
                    favoriteBtn.classList.remove("active");
                } else {
                    favorites.push(index);
                    favoriteBtn.classList.add("active");
                }
                localStorage.setItem("favorites", JSON.stringify(favorites));
            });
        }

        setupSizeButtons();

        const addToCartBtn = document.getElementById("add-to-cart");
        if(addToCartBtn){
            addToCartBtn.addEventListener("click", () => {
                const sizeSelected = document.querySelector('.size-btn.active');
                if(!sizeSelected){
                    alert("Please select a size!");
                    return;
                }
                const size = sizeSelected.textContent;

                const existing = cart.find(item => item.name === product.name && item.size === size);
                if(existing){
                    existing.qty++;
                } else {
                    cart.push({name: product.name, price: product.price, size: size, qty: 1});
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                 
        alert("Added to Bag");

       
            });
        }
    }

    function populateBag(){
        const bagGrid = document.getElementById("bag-grid");
        if(!bagGrid) return;

        cart = JSON.parse(localStorage.getItem("cart")) || [];
        bagGrid.innerHTML = "";

        if(cart.length === 0){
            bagGrid.innerHTML = `<p>Your bag is empty</p>
                <a href="index.html"><button class="shop-btn">Go Shop</button></a>`;
            return;
        }

        let total = 0;
        cart.forEach((item,index)=>{
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const div = document.createElement("div");
            div.className = "bag-item";
            div.innerHTML = `
                <strong>${item.name} (Size: ${item.size})</strong><br>
                Price: ₱${item.price} | Quantity: 
                <button onclick="changeQty(${index}, -1)">−</button>
                ${item.qty}
                <button onclick="changeQty(${index}, 1)">+</button>
                | Total: ₱${itemTotal}
                <button onclick="removeItem(${index})">Remove</button>
                <hr>
            `;
            bagGrid.appendChild(div);
        });

        document.getElementById("bag-total").textContent = total;
    }

    function changeQty(index, change){
        cart = JSON.parse(localStorage.getItem("cart"));
        cart[index].qty += change;
        if(cart[index].qty <= 0) cart.splice(index,1);
        localStorage.setItem("cart", JSON.stringify(cart));
        populateBag();
    }

    function removeItem(index){
        cart = JSON.parse(localStorage.getItem("cart"));
        cart.splice(index,1);
        localStorage.setItem("cart", JSON.stringify(cart));
        populateBag();
    }

    function setupSizeButtons() {
        const sizeButtons = document.querySelectorAll(".size-btn");
        sizeButtons.forEach(button => {
            button.addEventListener("click", () => {
                sizeButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
            });
        });
    }

    function setupCheckout(){
        const itemsDiv = document.getElementById("checkout-items");
        const totalSpan = document.getElementById("checkout-total");
        const placeOrderBtn = document.getElementById("place-order-btn");
        if(!itemsDiv || !totalSpan || !placeOrderBtn) return;

        cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart(){
            itemsDiv.innerHTML = "";
            let total = 0;
            if(cart.length === 0){
                itemsDiv.innerHTML = "<p>Your bag is empty.</p>";
                totalSpan.textContent = "0";
                return;
            }
            cart.forEach((item,index)=>{
                const itemTotal = item.price * item.qty;
                total += itemTotal;
                const div = document.createElement("div");
                div.className = "checkout-item";
                div.innerHTML = `
                    <div>
                        <strong>${item.name} (Size: ${item.size})</strong><br>₱${item.price}
                    </div>
                    <div class="qty-controls">
                        <button data-index="${index}" data-change="-1">−</button>
                        ${item.qty}
                        <button data-index="${index}" data-change="1">+</button>
                    </div>
                    <strong>₱${itemTotal}</strong>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                `;
                itemsDiv.appendChild(div);
            });
            totalSpan.textContent = total;
            attachCartButtons();
        }

        function attachCartButtons(){
            document.querySelectorAll('.qty-controls button').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const idx = parseInt(btn.dataset.index);
                    const change = parseInt(btn.dataset.change);
                    cart[idx].qty += change;
                    if(cart[idx].qty <=0) cart.splice(idx,1);
                    localStorage.setItem("cart",JSON.stringify(cart));
                    renderCart();
                });
            });
            document.querySelectorAll('.remove-btn').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const idx = parseInt(btn.dataset.index);
                    cart.splice(idx,1);
                    localStorage.setItem("cart",JSON.stringify(cart));
                    renderCart();
                });
            });
        }

        placeOrderBtn.addEventListener("click", ()=>{
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const city = document.getElementById("city").value;
            const phone = document.getElementById("phone").value;
            const payment = document.querySelector('input[name="payment"]:checked')?.value;
            if(!name || !address || !city || !phone || !payment){
                alert("Please fill all shipping details and select payment.");
                return;
            }
            const order = {cart, total: totalSpan.textContent, shipping:{name,address,city,phone}, payment};
            localStorage.setItem("order", JSON.stringify(order));
            localStorage.removeItem("cart");
            window.location.href="Confirmation.html";
        });

        renderCart();
    }

    const navbarHeart = document.getElementById("navbar-heart");
    if(navbarHeart){
        navbarHeart.addEventListener("click", ()=>window.location.href="Checkout.html");
    }

    document.addEventListener("DOMContentLoaded", ()=>{
        const category = document.body.dataset.category;
        if(category) populateProducts(category);
        if(document.querySelector('.product-preview')) populatePreview();
        if(document.body.dataset.page==="bag") populateBag();
        if(document.body.dataset.page==="checkout") setupCheckout();
    });


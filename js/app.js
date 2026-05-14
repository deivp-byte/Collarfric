document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Animaciones On-Scroll y Navbar ---
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // --- 2. Lógica del Carrito (Estado React-like) ---
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Instancia del Offcanvas de Bootstrap para abrirlo vía JS
    const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));

    function renderCart() {
        cartItemsContainer.innerHTML = ''; 
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-muted text-center mt-5">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                
                const itemHTML = `
                    <div class="d-flex align-items-center gap-3 border p-2 rounded-3">
                        <div class="bg-light rounded" style="width: 60px; height: 60px; overflow: hidden;">
                            <img src="${item.img}" alt="${item.name}" class="w-100 h-100 object-fit-cover">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-0 fw-bold">${item.name}</h6>
                            <small class="text-muted">${item.price.toFixed(2)} € x ${item.quantity}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        cartCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartTotalElement.textContent = total.toFixed(2);
    }

    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
        bsOffcanvas.show(); // Bootstrap abre el sidebar automáticamente
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        renderCart();
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart({
                id: button.getAttribute('data-id'),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                img: button.getAttribute('data-img') || ''
            });
        });
    });
});
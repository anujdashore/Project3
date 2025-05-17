document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-slider-dots .dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(currentSlide);
    }
    
    if (heroSlides.length > 0) {
        // Auto slide change every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const heroSlider = document.querySelector('.hero-slider');
        heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSlider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
        
        // Manual controls
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Dot navigation
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    if (testimonials.length > 0) {
        // Auto testimonial change every 6 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 6000);
        
        // Dot navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });
    }
    
    // Cart Functionality
    const cartBtn = document.querySelector('.nav-link.cart');
    const sideCart = document.querySelector('.side-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const emptyCart = document.querySelector('.empty-cart');
    let cart = [];
    
    // Load cart from localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }
    
    // Toggle cart
    if (cartBtn && sideCart) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sideCart.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart && cartOverlay) {
        closeCart.addEventListener('click', function() {
            sideCart.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        cartOverlay.addEventListener('click', function() {
            sideCart.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card, .deal-card');
            const productId = productCard.getAttribute('data-id') || Date.now().toString();
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace(/[^\d.]/g, ''));
            const productImg = productCard.querySelector('.product-img, .deal-img').style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1];
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    quantity: 1
                });
            }
            
            updateCart();
            showToast(`${productName} added to cart`);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
        
        // Update cart items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#" class="btn">Continue Shopping</a>
                </div>
            `;
        } else {
            let cartHTML = '';
            let totalAmount = 0;
            
            cart.forEach(item => {
                totalAmount += item.price * item.quantity;
                
                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                            <div class="cart-item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn minus">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                                    <button class="quantity-btn plus">+</button>
                                </div>
                                <button class="remove-item">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = cartHTML;
            cartTotal.textContent = `₹${totalAmount.toFixed(2)}`;
            
            // Add event listeners to quantity controls
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').getAttribute('data-id');
                    const item = cart.find(item => item.id === itemId);
                    const input = this.parentElement.querySelector('.quantity-input');
                    
                    if (this.classList.contains('plus')) {
                        item.quantity += 1;
                    } else if (this.classList.contains('minus') && item.quantity > 1) {
                        item.quantity -= 1;
                    }
                    
                    input.value = item.quantity;
                    updateCart();
                });
            });
            
            // Add event listeners to quantity inputs
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = this.closest('.cart-item').getAttribute('data-id');
                    const item = cart.find(item => item.id === itemId);
                    const newQuantity = parseInt(this.value);
                    
                    if (newQuantity >= 1) {
                        item.quantity = newQuantity;
                        updateCart();
                    } else {
                        this.value = item.quantity;
                    }
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = this.closest('.cart-item').getAttribute('data-id');
                    cart = cart.filter(item => item.id !== itemId);
                    updateCart();
                });
            });
        }
    }
    
    // Toast Notification
    function showToast(message) {
        const toast = document.querySelector('.toast');
        toast.querySelector('p').textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
    
    // Auth Modals
    const accountBtn = document.querySelector('.nav-link.account');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const authOverlay = document.querySelector('.auth-overlay');
    const closeAuthButtons = document.querySelectorAll('.close-auth');
    const switchAuthButtons = document.querySelectorAll('.switch-auth');
    
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            authOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    closeAuthButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
            authOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    authOverlay.addEventListener('click', function() {
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
        authOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    switchAuthButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
            
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            
            // Simple validation
            if (email && password) {
                showToast('Login successful!');
                setTimeout(() => {
                    loginModal.classList.remove('active');
                    authOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }, 1500);
            } else {
                showToast('Please fill all fields');
            }
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#register-name').value;
            const email = this.querySelector('#register-email').value;
            const password = this.querySelector('#register-password').value;
            const confirm = this.querySelector('#register-confirm').value;
            
            // Simple validation
            if (name && email && password && confirm) {
                if (password !== confirm) {
                    showToast('Passwords do not match');
                    return;
                }
                
                showToast('Registration successful!');
                setTimeout(() => {
                    registerModal.classList.remove('active');
                    authOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }, 1500);
            } else {
                showToast('Please fill all fields');
            }
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showToast('Thank you for subscribing!');
                this.reset();
            } else {
                showToast('Please enter your email');
            }
        });
    }
    
    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Sample Data for Products and Deals
    const products = [
        {
            id: '1',
            name: 'Wireless Earbuds',
            price: 1299,
            category: 'electronics',
            rating: 4.5,
            reviews: 124,
            image: 'ShopVista.img/WirelessEarbuds.webp'
        },
        {
            id: '2',
            name: 'Smartphone X12',
            price: 19999,
            category: 'electronics',
            rating: 4,
            reviews: 89,
            image: 'ShopVista.img/SmartphoneX12.webp'
        },
        {
            id: '3',
            name: 'Men\'s Casual Shirt',
            price: 799,
            category: 'fashion',
            rating: 5,
            reviews: 256,
            image: 'ShopVista.img/CasualShirt.webp'
        },
        {
            id: '4',
            name: 'Women\'s Handbag',
            price: 1499,
            category: 'fashion',
            rating: 4.5,
            reviews: 178,
            image: 'ShopVista.img/Womenhandbag.webp'
        },
        {
            id: '5',
            name: 'Bluetooth Speaker',
            price: 2499,
            category: 'electronics',
            rating: 4,
            reviews: 92,
            image: 'ShopVista.img/Altraspeaker.webp'
        },
        {
            id: '6',
            name: 'Running Shoes',
            price: 2999,
            category: 'fashion',
            rating: 4.5,
            reviews: 210,
            image: 'ShopVista.img/RunningShoes.webp'
        },
        {
            id: '7',
            name: 'Coffee Maker',
            price: 3499,
            category: 'home',
            rating: 4,
            reviews: 76,
            image: 'ShopVista.img/CoffeeMaker.webp'
        },
        {
            id: '8',
            name: 'Smart Watch',
            price: 2999,
            category: 'electronics',
            rating: 4.5,
            reviews: 145,
            image: 'ShopVista.img/BrandWatch.webp'
        }
    ];
    
    const deals = [
        {
            id: 'd1',
            name: 'Wireless Headphones',
            price: 2099,
            oldPrice: 2999,
            discount: 30,
            image: 'ShopVista.img/WirelessHeadphones.webp'
        },
        {
            id: 'd2',
            name: 'Smart Watch',
            price: 2999,
            oldPrice: 5999,
            discount: 50,
            image: 'ShopVista.img/Smartwatch.webp'
        },
        {
            id: 'd3',
            name: 'Bluetooth Speaker',
            price: 1499,
            oldPrice: 1999,
            discount: 25,
            image: 'ShopVista.img/BluetoothSpeaker.webp'
        },
        {
            id: 'd4',
            name: 'Fitness Band',
            price: 2099,
            oldPrice: 3499,
            discount: 40,
            image: 'ShopVista.img/FitnessBand.webp'
        }
    ];
    
    const categories = [
        {
            name: 'Electronics',
            image: 'ShopVista.img/Electronics.webp'
        },
        {
            name: 'Fashion',
            image: 'ShopVista.img/Fashion.webp'
        },
        {
            name: 'Home & Kitchen',
            image: 'ShopVista.img/Home&Kitchen.webp'
        },
        {
            name: 'Beauty',
            image: 'ShopVista.img/Beauty.webp'
        }
    ];
    
    // Populate Products
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        products.forEach(product => {
            const ratingStars = Array.from({ length: 5 }, (_, i) => 
                i < Math.floor(product.rating) ? 
                '<i class="fas fa-star"></i>' : 
                (i === Math.floor(product.rating) && product.rating % 1 >= 0.5 ? 
                '<i class="fas fa-star-half-alt"></i>' : 
                '<i class="far fa-star"></i>'
                )
            ).join('');
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', product.id);
            productCard.setAttribute('data-category', product.category);
            productCard.innerHTML = `
                <div class="product-img" style="background-image: url('${product.image}')"></div>
                <h3>${product.name}</h3>
                <div class="rating">
                    ${ratingStars}
                    <span>(${product.reviews})</span>
                </div>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Re-attach event listeners to new add to cart buttons
        document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        img: product.image,
                        quantity: 1
                    });
                }
                
                updateCart();
                showToast(`${product.name} added to cart`);
            });
        });
    }
    
    // Populate Deals
    const dealCardsContainer = document.querySelector('.deal-cards');
    if (dealCardsContainer) {
        deals.forEach(deal => {
            const dealCard = document.createElement('div');
            dealCard.className = 'deal-card';
            dealCard.setAttribute('data-id', deal.id);
            dealCard.innerHTML = `
                <div class="deal-tag">${deal.discount}% OFF</div>
                <div class="deal-img" style="background-image: url('${deal.image}')"></div>
                <h3>${deal.name}</h3>
                <p class="price"><span class="old-price">₹${deal.oldPrice.toLocaleString()}</span> ₹${deal.price.toLocaleString()}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;
            
            dealCardsContainer.appendChild(dealCard);
        });
        
        // Re-attach event listeners to new add to cart buttons
        document.querySelectorAll('.deal-card .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const dealCard = this.closest('.deal-card');
                const dealId = dealCard.getAttribute('data-id');
                const deal = deals.find(d => d.id === dealId);
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === dealId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: dealId,
                        name: deal.name,
                        price: deal.price,
                        img: deal.image,
                        quantity: 1
                    });
                }
                
                updateCart();
                showToast(`${deal.name} added to cart`);
            });
        });
    }
    
    // Populate Categories
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        categories.forEach(category => {
            const categoryItem = document.createElement('a');
            categoryItem.className = 'category-item';
            categoryItem.href = '#';
            categoryItem.innerHTML = `
                <div class="category-img" style="background-image: url('${category.image}')"></div>
                <h3>${category.name}</h3>
            `;
            
            categoryGrid.appendChild(categoryItem);
        });
    }
    
    // Sticky Header on Scroll
    const navbar = document.querySelector('.navbar');
    const categoriesBar = document.querySelector('.categories');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            navbar.classList.add('sticky');
            categoriesBar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
            categoriesBar.classList.remove('sticky');
        }
    });
});
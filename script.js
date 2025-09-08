const products = {
    1: { name: 'Monthly Subscription Business Consulting', price: 250 },
    2: { name: 'Online Training Conference on Client Acquisition for Business', price: 500 },
    3: { name: 'Lifetime Subscription Services', price: 750 },
    4: { name: '1-on-1 Strategy Session (1 hour)', price: 150 },
    5: { name: 'Checklist: "Quick Start — How to Launch a Business in 7 Days"', price: 80 },
    6: { name: 'One-Month Mentorship with an Expert', price: 300 },
    7: { name: 'Website or Landing Page Review (video + PDF)', price: 120 }
};

let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('businessConsultingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('businessConsultingCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: products[productId].name,
            price: products[productId].price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartBadge.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} ${item.quantity > 1 ? `x ${item.quantity}` : ''}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
    }
    
    totalPrice.textContent = `Total: $${total}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Item added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const checkoutPage = document.createElement('div');
    checkoutPage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 4000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
    `;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    checkoutPage.innerHTML = `
        <div style="max-width: 600px;">
            <h2 style="color: #333; margin-bottom: 2rem;">Order Summary</h2>
            <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #333;">Your Selected Services</h3>
                ${cart.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef;">
                        <span>${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ''}</span>
                        <span style="font-weight: bold;">$${item.price * item.quantity}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #333; color: #333;">
                    <span>Total:</span>
                    <span>$${total}</span>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="sendOrderEmail()" style="background: #333; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: 600;">
                    Send Order via Email
                </button>
                <button onclick="closeCheckout()" style="background: #6c757d; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: 600;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(checkoutPage);
    document.body.style.overflow = 'hidden';
}

function sendOrderEmail() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderDetails = cart.map(item => 
        `${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ''} - $${item.price * item.quantity}`
    ).join('\n');
    
    const emailBody = `Hello,

I would like to inquire about the following services from your cart:

${orderDetails}

Total: $${total}

Please contact me to discuss the next steps.

Best regards`;

    const mailtoLink = `mailto:nkconsultla@gmail.com?subject=Service Inquiry - Cart Total $${total}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    setTimeout(() => {
        closeCheckout();
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
    }, 1000);
}

function closeCheckout() {
    const checkoutPage = document.querySelector('[style*="z-index: 4000"]');
    if (checkoutPage) {
        checkoutPage.remove();
        document.body.style.overflow = '';
    }
}

function sendEmail(event) {
    event.preventDefault();
    
    const honeypot = document.querySelector('input[name="honeypot"]').value;
    if (honeypot) {
        return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    let emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartDetails = cart.map(item => 
            `${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ''} - $${item.price * item.quantity}`
        ).join('\n');
        
        emailBody += `\n\nItems in Cart:\n${cartDetails}\nTotal: $${total}`;
    }
    
    const mailtoLink = `mailto:nkconsultla@gmail.com?subject=Contact Form - ${name}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    
    showSuccessMessage('Email client opened! Your message has been prepared.');
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showPlaceholder(pageName) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 10px; text-align: center; max-width: 500px; margin: 2rem;">
            <h3 style="margin-bottom: 1rem; color: #333;">${pageName}</h3>
            <p style="margin-bottom: 2rem; color: #666;">This is a placeholder page. In a real implementation, this would contain the actual ${pageName.toLowerCase()} content.</p>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #333; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initStickyHeader();
    smoothScroll();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar.classList.contains('active')) {
                toggleCart();
            }
            
            const checkoutPage = document.querySelector('[style*="z-index: 4000"]');
            if (checkoutPage) {
                closeCheckout();
            }
        }
    });
});
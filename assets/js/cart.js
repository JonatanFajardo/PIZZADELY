// ========== SHOPPING CART SYSTEM ==========
// Sistema de carrito de compras para PizzaDely

// Estado del carrito
let cart = [];

// Inicializar el sistema de carrito
$(document).ready(function() {
    // Cargar carrito desde localStorage si existe
    loadCartFromStorage();
    updateCartUI();

    // Event listeners
    setupEventListeners();
});

// ========== CONFIGURAR EVENT LISTENERS ==========
function setupEventListeners() {
    // Agregar al carrito
    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));
        const image = $(this).data('image');

        addToCart(name, price, image);

        // Feedback visual
        $(this).addClass('added');
        const originalText = $(this).find('a').text();
        $(this).find('a').html('<i class="fas fa-check"></i> Agregado');

        setTimeout(() => {
            $(this).removeClass('added');
            $(this).find('a').text(originalText);
        }, 1500);
    });

    // Abrir modal del carrito
    $('#cartIcon').on('click', function() {
        openModal('cartModal');
        renderCartItems();
    });

    // Cerrar modales
    $('.close-modal').on('click', function() {
        const modalId = $(this).data('modal');
        closeModal(modalId);
    });

    // Cerrar modal al hacer click fuera
    $('.modal').on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            closeModal($(this).attr('id'));
        }
    });

    // Ir a checkout
    $('#checkoutBtn').on('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        closeModal('cartModal');
        openModal('checkoutModal');
        renderCheckoutItems();
    });

    // Volver al carrito
    $('#backToCart').on('click', function() {
        closeModal('checkoutModal');
        openModal('cartModal');
    });

    // Confirmar pago
    $('#confirmPayment').on('click', function() {
        confirmPayment();
    });

    // Cerrar confirmación
    $('#closeConfirmation').on('click', function() {
        closeModal('confirmationModal');
        clearCart();
    });

    // Cambiar método de pago
    $('.payment-option').on('click', function() {
        $('.payment-option').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop('checked', true);

        // Mostrar/ocultar detalles de tarjeta
        if ($(this).find('input').val() === 'card') {
            $('#cardDetails').slideDown();
        } else {
            $('#cardDetails').slideUp();
        }
    });
}

// ========== FUNCIONES DEL CARRITO ==========
function addToCart(name, price, image) {
    // Buscar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();

    // Animación del ícono del carrito
    $('#cartIcon').addClass('bounce');
    setTimeout(() => {
        $('#cartIcon').removeClass('bounce');
    }, 500);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartUI();
    renderCartItems();
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCartToStorage();
            updateCartUI();
            renderCartItems();
        }
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// ========== ALMACENAMIENTO LOCAL ==========
function saveCartToStorage() {
    localStorage.setItem('pizzadely_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('pizzadely_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ========== ACTUALIZAR UI ==========
function updateCartUI() {
    const itemCount = getCartItemCount();
    const total = getCartTotal();

    // Actualizar contador del carrito
    $('.cart-count').text(itemCount);

    // Actualizar total
    $('#cartTotal').text(total.toFixed(2) + ' lps');
    $('#checkoutSubtotal').text(total.toFixed(2) + ' lps');
    $('#checkoutTotal').text(total.toFixed(2) + ' lps');
    $('#finalTotal').text(total.toFixed(2) + ' lps');
}

// ========== RENDERIZAR ITEMS DEL CARRITO ==========
function renderCartItems() {
    const container = $('#cartItems');
    container.empty();

    if (cart.length === 0) {
        $('.cart-empty').show();
        $('#checkoutBtn').prop('disabled', true);
        return;
    }

    $('.cart-empty').hide();
    $('#checkoutBtn').prop('disabled', false);

    cart.forEach(item => {
        const itemHTML = `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} lps c/u</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-quantity" data-item-id="${item.id}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-item-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-item-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(itemHTML);
    });

    // Event listeners para los controles de cantidad
    $('.increase-quantity').on('click', function() {
        const itemId = parseInt($(this).data('item-id'));
        updateQuantity(itemId, 1);
    });

    $('.decrease-quantity').on('click', function() {
        const itemId = parseInt($(this).data('item-id'));
        updateQuantity(itemId, -1);
    });

    $('.remove-item').on('click', function() {
        const itemId = parseInt($(this).data('item-id'));
        removeFromCart(itemId);
    });
}

// ========== RENDERIZAR ITEMS DEL CHECKOUT ==========
function renderCheckoutItems() {
    const container = $('#checkoutItems');
    container.empty();

    cart.forEach(item => {
        const itemHTML = `
            <div class="checkout-item">
                <div>
                    <span class="checkout-item-name">${item.name}</span>
                    <span class="checkout-item-quantity">x${item.quantity}</span>
                </div>
                <span class="checkout-item-price">${(item.price * item.quantity).toFixed(2)} lps</span>
            </div>
        `;
        container.append(itemHTML);
    });
}

// ========== CONFIRMAR PAGO ==========
function confirmPayment() {
    // Mostrar loading (opcional)
    const $confirmBtn = $('#confirmPayment');
    const originalText = $confirmBtn.html();
    $confirmBtn.html('<i class="fas fa-spinner fa-spin"></i> Procesando...');
    $confirmBtn.prop('disabled', true);

    // Simular procesamiento de pago (1.5 segundos)
    setTimeout(() => {
        // Generar número de orden aleatorio
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        $('#orderNumber').text(orderNumber);

        // Cerrar modal de checkout
        closeModal('checkoutModal');

        // Abrir modal de confirmación
        openModal('confirmationModal');

        // Restaurar botón
        $confirmBtn.html(originalText);
        $confirmBtn.prop('disabled', false);
    }, 1500);
}

// ========== MANEJO DE MODALES ==========
function openModal(modalId) {
    $(`#${modalId}`).addClass('show');
    $('body').css('overflow', 'hidden');
}

function closeModal(modalId) {
    $(`#${modalId}`).removeClass('show');
    $('body').css('overflow', 'auto');
}

// ========== ANIMACIÓN DEL CARRITO ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }

    .cart-icon.bounce {
        animation: bounce 0.5s ease;
    }

    .add-to-cart.added {
        background: #28a745 !important;
        transform: scale(1.05);
    }

    .add-to-cart.added a {
        color: white !important;
    }
`;
document.head.appendChild(style);

// ========== NOTIFICACIONES (OPCIONAL) ==========
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = $(`
        <div class="notification ${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `);

    // Agregar al body
    $('body').append(notification);

    // Mostrar con animación
    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Estilos para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 90px;
        right: -300px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        transition: right 0.3s ease;
        min-width: 250px;
    }

    .notification.show {
        right: 20px;
    }

    .notification.success {
        border-left: 4px solid #28a745;
    }

    .notification.success i {
        color: #28a745;
        font-size: 1.5rem;
    }

    .notification.error {
        border-left: 4px solid #dc3545;
    }

    .notification.error i {
        color: #dc3545;
        font-size: 1.5rem;
    }

    .notification span {
        font-weight: 600;
        color: var(--text-primary);
    }
`;
document.head.appendChild(notificationStyles);

// ========== LOG DE DEBUG ==========
console.log('%c🍕 PizzaDely Cart System Loaded', 'color: #ed3b43; font-size: 16px; font-weight: bold;');
console.log('%c📦 PROTOTIPO DE DEMOSTRACIÓN', 'color: #ffc107; font-size: 14px; font-weight: bold;');
console.log('Este es un sistema de carrito de compras funcional para demostración.');
console.log('Los pagos son simulados y los datos están prellenados.');

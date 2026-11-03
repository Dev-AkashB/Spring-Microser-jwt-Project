/**
 * FreshHarvest Grocery Storefront & Admin Portal
 * Connected to Spring Cloud Gateway & Distributed Microservices
 */

const API_BASE = (window.location.protocol === 'file:' || !window.location.port)
    ? 'http://localhost:8080'
    : '';

// App State
const state = {
    user: null, // { token, userId, email, fullName, roles: [] }
    categories: [],
    products: [],
    activeCategoryId: 'all',
    searchQuery: '',
    sortBy: 'default',
    cart: {
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        totalAmount: 0
    },
    orders: []
};

// DOM Elements
const DOM = {
    // Auth & Nav
    loginBtn: document.getElementById('loginBtn'),
    userMenu: document.getElementById('userMenu'),
    userMenuBtn: document.getElementById('userMenuBtn'),
    userDropdown: document.getElementById('userDropdown'),
    navUserInitial: document.getElementById('navUserInitial'),
    navUserName: document.getElementById('navUserName'),
    userEmailDisplay: document.getElementById('userEmailDisplay'),
    userRoleBadge: document.getElementById('userRoleBadge'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminPortalBtn: document.getElementById('adminPortalBtn'),
    adminSwitchLink: document.getElementById('adminSwitchLink'),
    myOrdersLink: document.getElementById('myOrdersLink'),

    // Demo Bar
    demoCustomerBtn: document.getElementById('demoCustomerBtn'),
    demoAdminBtn: document.getElementById('demoAdminBtn'),

    // Search & Filter
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    sortSelect: document.getElementById('sortSelect'),
    categoryPills: document.getElementById('categoryPills'),
    categoryCountLabel: document.getElementById('categoryCountLabel'),
    currentCategoryTitle: document.getElementById('currentCategoryTitle'),
    catalogSubtitle: document.getElementById('catalogSubtitle'),
    productGrid: document.getElementById('productGrid'),

    // Cart Drawer
    cartTriggerBtn: document.getElementById('cartTriggerBtn'),
    cartBadgeCount: document.getElementById('cartBadgeCount'),
    cartHeaderTotal: document.getElementById('cartHeaderTotal'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartFooter: document.getElementById('cartFooter'),
    drawerItemCount: document.getElementById('drawerItemCount'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartDeliveryFee: document.getElementById('cartDeliveryFee'),
    cartTax: document.getElementById('cartTax'),
    cartGrandTotal: document.getElementById('cartGrandTotal'),
    freeDeliveryProgress: document.getElementById('freeDeliveryProgress'),
    freeDeliveryLabel: document.getElementById('freeDeliveryLabel'),
    clearCartActionBtn: document.getElementById('clearCartActionBtn'),
    openCheckoutModalBtn: document.getElementById('openCheckoutModalBtn'),

    // Modals
    authModal: document.getElementById('authModal'),
    closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
    tabSignIn: document.getElementById('tabSignIn'),
    tabSignUp: document.getElementById('tabSignUp'),
    signInForm: document.getElementById('signInForm'),
    signUpForm: document.getElementById('signUpForm'),
    fillCustomer: document.getElementById('fillCustomer'),
    fillAdmin: document.getElementById('fillAdmin'),

    // SSO Elements
    ssoGoogleBtn: document.getElementById('ssoGoogleBtn'),
    ssoGithubBtn: document.getElementById('ssoGithubBtn'),
    ssoQuickCustomerBtn: document.getElementById('ssoQuickCustomerBtn'),
    demoSsoCustomerBtn: document.getElementById('demoSsoCustomerBtn'),
    ssoModal: document.getElementById('ssoModal'),
    closeSsoModalBtn: document.getElementById('closeSsoModalBtn'),
    ssoAccount1: document.getElementById('ssoAccount1'),
    ssoAccount2: document.getElementById('ssoAccount2'),
    ssoCustomName: document.getElementById('ssoCustomName'),
    ssoCustomEmail: document.getElementById('ssoCustomEmail'),
    ssoCustomSubmitBtn: document.getElementById('ssoCustomSubmitBtn'),

    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckoutBtn: document.getElementById('closeCheckoutBtn'),
    cancelCheckoutBtn: document.getElementById('cancelCheckoutBtn'),
    checkoutAddress: document.getElementById('checkoutAddress'),
    checkoutPhone: document.getElementById('checkoutPhone'),
    submitOrderBtn: document.getElementById('submitOrderBtn'),
    modalSummaryTotal: document.getElementById('modalSummaryTotal'),

    orderSuccessModal: document.getElementById('orderSuccessModal'),
    closeSuccessModalBtn: document.getElementById('closeSuccessModalBtn'),
    continueShoppingBtn: document.getElementById('continueShoppingBtn'),
    viewMyOrdersBtn: document.getElementById('viewMyOrdersBtn'),
    successOrderNum: document.getElementById('successOrderNum'),
    successTrackingCode: document.getElementById('successTrackingCode'),
    successStatus: document.getElementById('successStatus'),
    successTotalAmount: document.getElementById('successTotalAmount'),

    myOrdersModal: document.getElementById('myOrdersModal'),
    closeOrdersModalBtn: document.getElementById('closeOrdersModalBtn'),
    ordersListContainer: document.getElementById('ordersListContainer'),

    adminModal: document.getElementById('adminModal'),
    closeAdminModalBtn: document.getElementById('closeAdminModalBtn'),
    adminProductsTable: document.getElementById('adminProductsTable'),
    adminOrdersTable: document.getElementById('adminOrdersTable'),
    openAddProductFormBtn: document.getElementById('openAddProductFormBtn'),
    addProductForm: document.getElementById('addProductForm'),
    cancelAddProductBtn: document.getElementById('cancelAddProductBtn'),
    newProductForm: document.getElementById('newProductForm'),
    newProdCategory: document.getElementById('newProdCategory'),

    // Real-Time Top Bar & Live Clock
    liveClockDisplay: document.getElementById('liveClockDisplay'),
    deliverySlotDisplay: document.getElementById('deliverySlotDisplay'),
    announcementMarquee: document.getElementById('announcementMarquee'),
    locationPickerBtn: document.getElementById('locationPickerBtn'),
    selectedAddressLabel: document.getElementById('selectedAddressLabel'),

    // Live Search Suggestions Dropdown
    searchContainer: document.getElementById('searchContainer'),
    searchSuggestionsDropdown: document.getElementById('searchSuggestionsDropdown'),
    suggestionsTitle: document.getElementById('suggestionsTitle'),
    suggestionsCount: document.getElementById('suggestionsCount'),
    suggestionsList: document.getElementById('suggestionsList'),

    // Real-Time Nav Tracker
    navOrderTrackerBtn: document.getElementById('navOrderTrackerBtn'),
    navTrackerCount: document.getElementById('navTrackerCount'),

    // Real-Time Subnav & Departments
    subnavBar: document.getElementById('subnavBar'),
    departmentsMenuBtn: document.getElementById('departmentsMenuBtn'),
    departmentsFlyoutMenu: document.getElementById('departmentsFlyoutMenu'),
    subnavLinks: document.getElementById('subnavLinks'),

    // Real-Time Sitemap Footer
    newsletterForm: document.getElementById('newsletterForm'),
    newsletterEmail: document.getElementById('newsletterEmail'),
    backToTopBtn: document.getElementById('backToTopBtn'),
    sitemapTrackOrderLink: document.getElementById('sitemapTrackOrderLink'),
    sitemapMyOrdersLink: document.getElementById('sitemapMyOrdersLink'),
    sitemapOpenCartLink: document.getElementById('sitemapOpenCartLink'),
    sitemapAddressesLink: document.getElementById('sitemapAddressesLink'),
    sitemapAdminLink: document.getElementById('sitemapAdminLink'),

    toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initEventListeners();
    initLiveClock();
    initAnnouncementMarquee();
    initLiveSearchSuggestions();
    initSubnavAndDepartments();
    initSitemapInteractivity();
    loadStoredAuth();
    await loadCategories();
    await loadProducts();
    if (state.user) {
        await fetchCart();
        await loadMyOrdersCount();
    }
});

function loadStoredAuth() {
    try {
        const stored = localStorage.getItem('freshharvest_user');
        if (stored) {
            state.user = JSON.parse(stored);
            updateNavUser();
        }
    } catch (e) {
        console.warn('Failed to parse stored auth user', e);
    }
}

// ==========================================
// API Helper
// ==========================================
async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (state.user && state.user.token) {
        headers['Authorization'] = `Bearer ${state.user.token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            // Token expired or invalid
            if (state.user) {
                showToast('Session expired. Please sign in again.', 'error');
                logout();
            }
            throw new Error('Unauthorized');
        }
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            const message = data && data.error ? data.error : (data && data.message ? data.message : `HTTP ${response.status}`);
            throw new Error(message);
        }
        return data;
    } catch (err) {
        throw err;
    }
}

// ==========================================
// Data Loaders
// ==========================================
async function loadCategories() {
    try {
        const data = await apiRequest('/api/categories');
        state.categories = Array.isArray(data) ? data : [];
        renderCategoryPills();
        renderDepartmentsFlyout();
        populateAdminCategorySelect();
    } catch (e) {
        console.error('Failed to load categories', e);
        DOM.categoryCountLabel.textContent = 'Demo Mode (Offline)';
    }
}

async function loadProducts() {
    DOM.productGrid.innerHTML = `
        <div class="grid-loading">
            <div class="spinner"></div>
            <p>Fetching fresh groceries from Catalog Service (Port 8082)...</p>
        </div>
    `;

    try {
        let endpoint = '/api/products';
        const params = new URLSearchParams();
        if (state.activeCategoryId !== 'all') {
            params.append('categoryId', state.activeCategoryId);
        }
        if (state.searchQuery.trim()) {
            params.append('search', state.searchQuery.trim());
        }
        const qs = params.toString();
        if (qs) endpoint += `?${qs}`;

        const data = await apiRequest(endpoint);
        state.products = Array.isArray(data) ? data : [];
        sortAndRenderProducts();
        renderDepartmentsFlyout();
    } catch (e) {
        console.error('Failed to load products', e);
        DOM.productGrid.innerHTML = `
            <div class="grid-loading">
                <p style="color: var(--danger);">⚠️ Could not connect to Catalog Service (Port 8082).<br>Make sure services are running via <code>.\\start-all.bat</code>.</p>
            </div>
        `;
    }
}

async function fetchCart() {
    if (!state.user) return;
    try {
        const data = await apiRequest('/api/cart');
        if (data) {
            state.cart = data;
            updateCartBadge();
            renderCartItems();
        }
    } catch (e) {
        console.warn('Failed to fetch cart', e);
    }
}

// ==========================================
// Rendering Functions
// ==========================================
function renderCategoryPills() {
    DOM.categoryCountLabel.textContent = `${state.categories.length} Categories available`;

    let html = `
        <button class="category-pill ${state.activeCategoryId === 'all' ? 'active' : ''}" data-id="all">
            <span class="pill-icon">🌟</span>
            <span>All Groceries</span>
        </button>
    `;

    state.categories.forEach(cat => {
        const isActive = state.activeCategoryId === String(cat.id);
        html += `
            <button class="category-pill ${isActive ? 'active' : ''}" data-id="${cat.id}">
                <span class="pill-icon">${cat.icon || '🥦'}</span>
                <span>${escapeHtml(cat.name)}</span>
            </button>
        `;
    });

    DOM.categoryPills.innerHTML = html;

    // Attach click handlers
    DOM.categoryPills.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const catId = btn.getAttribute('data-id');
            filterCategoryById(catId);
        });
    });
}

function sortAndRenderProducts() {
    let list = [...state.products];
    renderDepartmentsFlyout();

    if (state.sortBy === 'price-low') {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (state.sortBy === 'price-high') {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (state.sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (list.length === 0) {
        DOM.productGrid.innerHTML = `
            <div class="grid-loading">
                <div style="font-size: 3rem;">🔍</div>
                <h3>No groceries found</h3>
                <p>Try clearing your search filters or browse other categories.</p>
            </div>
        `;
        return;
    }

    DOM.productGrid.innerHTML = list.map(prod => {
        const cartItem = state.cart.items.find(i => i.productId === prod.id);
        const inCartQty = cartItem ? cartItem.quantity : 0;
        const hasDiscount = prod.discountPrice && prod.discountPrice < prod.price;
        const effPrice = hasDiscount ? prod.discountPrice : prod.price;

        return `
            <div class="product-card" data-id="${prod.id}">
                <div class="card-image-wrap">
                    <img src="${escapeHtml(prod.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500')}" 
                         alt="${escapeHtml(prod.name)}" 
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';">
                    ${hasDiscount ? `<span class="discount-tag">SALE</span>` : ''}
                    <span class="stock-tag">${prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Out of Stock'}</span>
                </div>
                <div class="card-body">
                    <span class="card-category">${escapeHtml(prod.categoryName || 'Grocery')}</span>
                    <h3 class="card-title">${escapeHtml(prod.name)}</h3>
                    <span class="card-unit">${escapeHtml(prod.unit || '1 unit')}</span>
                    
                    <div class="card-footer">
                        <div class="price-wrap">
                            <span class="current-price">$${Number(effPrice).toFixed(2)}</span>
                            ${hasDiscount ? `<span class="original-price">$${Number(prod.price).toFixed(2)}</span>` : ''}
                        </div>
                        
                        <div class="card-action-wrap" id="action-wrap-${prod.id}">
                            ${inCartQty > 0 ? `
                                <div class="qty-counter">
                                    <button class="qty-btn" onclick="updateItemQty(${cartItem.id}, ${inCartQty - 1})">-</button>
                                    <span class="qty-num">${inCartQty}</span>
                                    <button class="qty-btn" onclick="updateItemQty(${cartItem.id}, ${inCartQty + 1})">+</button>
                                </div>
                            ` : `
                                <button class="btn-add-cart" onclick="handleAddToCart(${prod.id})" ${prod.stockQuantity <= 0 ? 'disabled' : ''}>
                                    ${prod.stockQuantity <= 0 ? 'Sold Out' : '+ Add'}
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCartBadge() {
    const totalQty = state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
    DOM.cartBadgeCount.textContent = totalQty;
    DOM.cartHeaderTotal.textContent = `$${Number(state.cart.totalAmount || 0).toFixed(2)}`;
    DOM.drawerItemCount.textContent = `${totalQty} items`;
}

function renderCartItems() {
    if (!state.cart.items || state.cart.items.length === 0) {
        DOM.cartItemsList.innerHTML = `
            <div class="empty-cart-state">
                <div class="empty-cart-icon">🛒</div>
                <p class="empty-title">Your basket is empty</p>
                <p class="empty-sub">Add farm-fresh produce and delicious snacks to get started!</p>
            </div>
        `;
        DOM.cartFooter.style.display = 'none';
        DOM.freeDeliveryProgress.style.width = '0%';
        DOM.freeDeliveryLabel.textContent = 'Add $35.00 for FREE delivery!';
        return;
    }

    DOM.cartFooter.style.display = 'block';

    // Update totals
    const subtotal = Number(state.cart.subtotal || 0);
    DOM.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    DOM.cartDeliveryFee.textContent = state.cart.deliveryFee > 0 ? `$${Number(state.cart.deliveryFee).toFixed(2)}` : 'Free';
    DOM.cartTax.textContent = `$${Number(state.cart.tax || 0).toFixed(2)}`;
    DOM.cartGrandTotal.textContent = `$${Number(state.cart.totalAmount || 0).toFixed(2)}`;

    // Free delivery progress
    const freeDeliveryThreshold = 35.0;
    const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
    DOM.freeDeliveryProgress.style.width = `${progressPercent}%`;

    if (subtotal >= freeDeliveryThreshold) {
        DOM.freeDeliveryLabel.innerHTML = '🎉 You qualify for <strong>FREE Delivery!</strong>';
    } else {
        const remaining = (freeDeliveryThreshold - subtotal).toFixed(2);
        DOM.freeDeliveryLabel.textContent = `Add $${remaining} more for FREE delivery!`;
    }

    DOM.cartItemsList.innerHTML = state.cart.items.map(item => `
        <div class="cart-item-row">
            <img class="cart-item-img" src="${escapeHtml(item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500')}" alt="${escapeHtml(item.productName)}">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${escapeHtml(item.productName)}</h4>
                <div class="cart-item-unit">${escapeHtml(item.productUnit || '1 unit')}</div>
                <div class="cart-item-price">$${Number(item.unitPrice).toFixed(2)} × ${item.quantity} = $${Number(item.subtotal).toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="qty-counter">
                    <button class="qty-btn" onclick="updateItemQty(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="qty-num">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQty(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="btn-remove-item" onclick="removeCartItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateNavUser() {
    if (state.user) {
        DOM.loginBtn.style.display = 'none';
        DOM.userMenu.style.display = 'block';
        DOM.navUserName.textContent = state.user.fullName || state.user.email.split('@')[0];
        DOM.navUserInitial.textContent = (state.user.fullName || state.user.email)[0].toUpperCase();
        DOM.userEmailDisplay.textContent = state.user.email;

        const isAdmin = state.user.roles && (state.user.roles.includes('ROLE_ADMIN') || state.user.roles.includes('ADMIN'));
        DOM.userRoleBadge.textContent = isAdmin ? 'ADMIN' : 'CUSTOMER';
        DOM.userRoleBadge.className = `role-badge ${isAdmin ? 'admin-chip' : ''}`;

        DOM.adminPortalBtn.style.display = isAdmin ? 'block' : 'none';
        DOM.adminSwitchLink.style.display = isAdmin ? 'block' : 'none';
        loadMyOrdersCount();
    } else {
        DOM.loginBtn.style.display = 'flex';
        DOM.userMenu.style.display = 'none';
        DOM.adminPortalBtn.style.display = 'none';
        DOM.adminSwitchLink.style.display = 'none';
        updateNavTrackerCount();
    }
}

// ==========================================
// Cart Operations
// ==========================================
window.handleAddToCart = async function(productId) {
    if (!state.user) {
        showToast('Please sign in to add items to your basket', 'info');
        openAuthModal('signin');
        return;
    }

    try {
        await apiRequest('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity: 1 })
        });
        showToast('Added to grocery basket!', 'success');
        await fetchCart();
        sortAndRenderProducts(); // Update the card button to counter
    } catch (e) {
        showToast(`Failed to add item: ${e.message}`, 'error');
    }
};

window.updateItemQty = async function(cartItemId, newQuantity) {
    if (!state.user) return;
    try {
        await apiRequest(`/api/cart/${cartItemId}?quantity=${newQuantity}`, {
            method: 'PUT'
        });
        await fetchCart();
        sortAndRenderProducts();
    } catch (e) {
        showToast(`Could not update quantity: ${e.message}`, 'error');
    }
};

window.removeCartItem = async function(cartItemId) {
    if (!state.user) return;
    try {
        await apiRequest(`/api/cart/${cartItemId}`, {
            method: 'DELETE'
        });
        showToast('Item removed from basket', 'info');
        await fetchCart();
        sortAndRenderProducts();
    } catch (e) {
        showToast(`Could not remove item: ${e.message}`, 'error');
    }
};

// ==========================================
// Auth Handlers
// ==========================================
async function handleSignIn(email, password) {
    try {
        const res = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        state.user = res;
        localStorage.setItem('freshharvest_user', JSON.stringify(res));
        updateNavUser();
        closeModal(DOM.authModal);
        showToast(`Welcome back, ${res.fullName || res.email}!`, 'success');

        await fetchCart();
        sortAndRenderProducts();
    } catch (e) {
        showToast(`Sign in failed: ${e.message}`, 'error');
    }
}

async function handleSignUp(fullName, email, password, phone) {
    try {
        const res = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, password, phone })
        });

        state.user = res;
        localStorage.setItem('freshharvest_user', JSON.stringify(res));
        updateNavUser();
        closeModal(DOM.authModal);
        showToast(`Account created successfully! Welcome, ${res.fullName}!`, 'success');

        await fetchCart();
        sortAndRenderProducts();
    } catch (e) {
        showToast(`Registration failed: ${e.message}`, 'error');
    }
}

async function handleSsoLogin(provider = 'GOOGLE', email = 'alex.morgan@gmail.com', fullName = 'Alex Morgan', phone = '+1-555-0199') {
    try {
        showToast(`Connecting to ${provider} Single Sign-On...`, 'info');
        const res = await apiRequest('/api/auth/sso', {
            method: 'POST',
            body: JSON.stringify({
                provider,
                email,
                fullName,
                phone
            })
        });

        state.user = res;
        localStorage.setItem('freshharvest_user', JSON.stringify(res));
        updateNavUser();
        if (DOM.authModal) closeModal(DOM.authModal);
        if (DOM.ssoModal) closeModal(DOM.ssoModal);
        showToast(`Signed in via ${provider} SSO! Welcome, ${res.fullName || res.email}!`, 'success');

        await fetchCart();
        sortAndRenderProducts();
    } catch (e) {
        showToast(`SSO Sign In failed: ${e.message}`, 'error');
    }
}

function openSsoModal(provider = 'GOOGLE') {
    if (DOM.authModal) closeModal(DOM.authModal);
    const titleEl = document.getElementById('ssoModalTitle');
    if (titleEl) {
        titleEl.textContent = provider === 'GITHUB' ? 'Sign in with GitHub SSO' : 'Sign in with Google SSO';
    }
    openModal(DOM.ssoModal);
}

function logout() {
    state.user = null;
    localStorage.removeItem('freshharvest_user');
    state.cart = { items: [], subtotal: 0, deliveryFee: 0, tax: 0, totalAmount: 0 };
    updateNavUser();
    updateCartBadge();
    renderCartItems();
    sortAndRenderProducts();
    DOM.userDropdown.classList.remove('show');
    showToast('Signed out successfully.', 'info');
}

// ==========================================
// Orders & Checkout
// ==========================================
async function submitOrder() {
    if (!state.user) return;

    const address = DOM.checkoutAddress.value.trim();
    const phone = DOM.checkoutPhone.value.trim();
    const selectedPayMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedPayMethod ? selectedPayMethod.value : 'CASH_ON_DELIVERY';

    if (!address) {
        showToast('Please enter a delivery address', 'error');
        DOM.checkoutAddress.focus();
        return;
    }

    DOM.submitOrderBtn.disabled = true;
    DOM.submitOrderBtn.textContent = 'Processing Order...';

    try {
        const res = await apiRequest('/api/orders/checkout', {
            method: 'POST',
            body: JSON.stringify({
                deliveryAddress: address,
                recipientPhone: phone,
                paymentMethod: paymentMethod
            })
        });

        // Order placed successfully!
        closeModal(DOM.checkoutModal);
        closeCartDrawer();
        await fetchCart();
        sortAndRenderProducts();
        await loadMyOrdersCount();

        // Show Success & Live Tracker Modal
        DOM.successOrderNum.textContent = res.orderNumber || `GROC-${res.id}`;
        DOM.successTrackingCode.textContent = res.deliveryTrackingCode || 'TRK-ASSIGNED';
        DOM.successStatus.textContent = res.status || 'CONFIRMED';
        DOM.successTotalAmount.textContent = `$${Number(res.totalAmount).toFixed(2)}`;

        openModal(DOM.orderSuccessModal);
        showToast('Order confirmed! Our shoppers are packing your basket.', 'success');

    } catch (e) {
        showToast(`Order checkout failed: ${e.message}`, 'error');
    } finally {
        DOM.submitOrderBtn.disabled = false;
        DOM.submitOrderBtn.textContent = 'Place Grocery Order';
    }
}

async function loadMyOrders() {
    if (!state.user) return;
    openModal(DOM.myOrdersModal);
    DOM.ordersListContainer.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Fetching your orders...</p></div>`;

    try {
        const orders = await apiRequest('/api/orders/user');
        state.orders = Array.isArray(orders) ? orders : [];
        updateNavTrackerCount();

        if (state.orders.length === 0) {
            DOM.ordersListContainer.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-cart-icon">📦</div>
                    <p class="empty-title">No orders yet</p>
                    <p class="empty-sub">Once you place your first order, you can track it live here!</p>
                </div>
            `;
            return;
        }

        DOM.ordersListContainer.innerHTML = state.orders.map(o => `
            <div class="order-receipt-card" style="margin-bottom: 16px;">
                <div class="receipt-row" style="border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    <div>
                        <strong>${escapeHtml(o.orderNumber || `Order #${o.id}`)}</strong>
                        <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">${formatDate(o.orderDate)}</span>
                    </div>
                    <span class="status-pill status-${(o.status || 'confirmed').toLowerCase()}">${escapeHtml(o.status)}</span>
                </div>
                <div style="margin: 10px 0; font-size: 0.85rem;">
                    <strong>Items:</strong>
                    <ul style="padding-left: 20px; margin-top: 4px; color: var(--text-muted);">
                        ${o.items.map(i => `<li>${escapeHtml(i.productName)} (${escapeHtml(i.productUnit || '1 unit')}) × ${i.quantity} - $${Number(i.subtotal).toFixed(2)}</li>`).join('')}
                    </ul>
                </div>
                <div class="receipt-row">
                    <span>Delivery Address:</span>
                    <span style="max-width: 60%; text-align: right;">${escapeHtml(o.deliveryAddress || 'Standard delivery')}</span>
                </div>
                <div class="receipt-row">
                    <span>Payment Method:</span>
                    <span>${escapeHtml(o.paymentMethod || 'Cash on Delivery')}</span>
                </div>
                <div class="receipt-row total-row" style="margin-top: 8px;">
                    <span>Total Amount:</span>
                    <span style="color: var(--primary-dark);">$${Number(o.totalAmount).toFixed(2)}</span>
                </div>
                ${(o.status === 'CONFIRMED' || o.status === 'PENDING') ? `
                    <div style="text-align: right; margin-top: 10px;">
                        <button class="btn-remove-item" style="font-size: 0.825rem; font-weight: 700;" onclick="cancelOrder(${o.id})">Cancel Order</button>
                    </div>
                ` : ''}
            </div>
        `).join('');

    } catch (e) {
        DOM.ordersListContainer.innerHTML = `<p style="color: var(--danger);">Failed to load orders: ${e.message}</p>`;
    }
}

window.cancelOrder = async function(orderId) {
    if (!confirm('Are you sure you want to cancel this order? Stock will be restored and payment refunded.')) return;
    try {
        await apiRequest(`/api/orders/${orderId}/cancel`, { method: 'POST' });
        showToast('Order cancelled successfully', 'info');
        loadMyOrders();
        loadProducts(); // Refresh stock
    } catch (e) {
        showToast(`Could not cancel order: ${e.message}`, 'error');
    }
};

// ==========================================
// Admin Portal Handlers
// ==========================================
function openAdminPortal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!state.user || !state.user.roles.includes('ROLE_ADMIN')) {
        showToast('Admin role required', 'error');
        return;
    }
    window.location.href = 'admin.html';
}

async function loadAdminProducts() {
    try {
        const prods = await apiRequest('/api/products');
        DOM.adminProductsTable.querySelector('tbody').innerHTML = prods.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td>
                    <strong>${escapeHtml(p.name)}</strong>
                </td>
                <td><span class="role-badge">${escapeHtml(p.categoryName || 'General')}</span></td>
                <td>${escapeHtml(p.unit || '1 unit')}</td>
                <td>$${Number(p.discountPrice || p.price).toFixed(2)}</td>
                <td>
                    <span style="font-weight: 700; color: ${p.stockQuantity < 20 ? 'var(--danger)' : 'var(--primary-dark)'};">
                        ${p.stockQuantity}
                    </span>
                </td>
                <td>
                    <button class="btn-remove-item" onclick="deleteAdminProduct(${p.id})">Deactivate</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Failed to load admin products', e);
    }
}

async function loadAdminOrders() {
    try {
        const orders = await apiRequest('/api/orders');
        DOM.adminOrdersTable.querySelector('tbody').innerHTML = orders.map(o => `
            <tr>
                <td><strong>${escapeHtml(o.orderNumber || `#${o.id}`)}</strong></td>
                <td>
                    <div>${escapeHtml(o.customerName || 'Customer')}</div>
                    <small style="color: var(--text-muted);">${escapeHtml(o.customerEmail || '')}</small>
                </td>
                <td>${o.items ? o.items.length : 0} items</td>
                <td><strong>$${Number(o.totalAmount).toFixed(2)}</strong></td>
                <td>${escapeHtml(o.paymentMethod || 'COD')}</td>
                <td><span class="status-pill status-${(o.status || 'confirmed').toLowerCase()}">${escapeHtml(o.status)}</span></td>
                <td>
                    <select onchange="updateOrderStatusAdmin(${o.id}, this.value)" class="styled-select" style="padding: 4px 8px; font-size: 0.775rem;">
                        <option value="">Change Status...</option>
                        <option value="PACKING">PACKING</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error('Failed to load admin orders', e);
    }
}

window.updateOrderStatusAdmin = async function(orderId, newStatus) {
    if (!newStatus) return;
    try {
        await apiRequest(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
        loadAdminOrders();
    } catch (e) {
        showToast(`Status update failed: ${e.message}`, 'error');
    }
};

window.deleteAdminProduct = async function(productId) {
    if (!confirm('Mark this product as inactive in catalog?')) return;
    try {
        await apiRequest(`/api/products/${productId}`, { method: 'DELETE' });
        showToast('Product deactivated', 'info');
        loadAdminProducts();
        loadProducts();
    } catch (e) {
        showToast(`Failed: ${e.message}`, 'error');
    }
};

function populateAdminCategorySelect() {
    DOM.newProdCategory.innerHTML = state.categories.map(c => `
        <option value="${c.id}">${escapeHtml(c.name)}</option>
    `).join('');
}

async function handleCreateProduct(e) {
    e.preventDefault();
    const name = document.getElementById('newProdName').value.trim();
    const categoryId = Number(document.getElementById('newProdCategory').value);
    const price = parseFloat(document.getElementById('newProdPrice').value);
    const discountVal = document.getElementById('newProdDiscount').value;
    const discountPrice = discountVal ? parseFloat(discountVal) : null;
    const unit = document.getElementById('newProdUnit').value.trim();
    const stockQuantity = parseInt(document.getElementById('newProdStock').value);
    const imageUrl = document.getElementById('newProdImage').value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    const description = document.getElementById('newProdDesc').value.trim();

    try {
        await apiRequest('/api/products', {
            method: 'POST',
            body: JSON.stringify({
                name, categoryId, price, discountPrice, unit, stockQuantity, imageUrl, description
            })
        });

        showToast(`Product "${name}" added to catalog!`, 'success');
        DOM.newProductForm.reset();
        DOM.addProductForm.style.display = 'none';
        await loadAdminProducts();
        await loadProducts();
    } catch (e) {
        showToast(`Failed to add product: ${e.message}`, 'error');
    }
}

// ==========================================
// Event Listeners
// ==========================================
function initEventListeners() {
    // Search
    let searchDebounce;
    DOM.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        DOM.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            loadProducts();
        }, 300);
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        state.searchQuery = '';
        DOM.clearSearchBtn.style.display = 'none';
        loadProducts();
    });

    // Sort
    DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        sortAndRenderProducts();
    });

    // Cart Drawer Open/Close
    DOM.cartTriggerBtn.addEventListener('click', openCartDrawer);
    DOM.closeCartBtn.addEventListener('click', closeCartDrawer);
    DOM.cartOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.cartOverlay) closeCartDrawer();
    });

    DOM.clearCartActionBtn.addEventListener('click', async () => {
        if (!confirm('Clear all items from your basket?')) return;
        try {
            await apiRequest('/api/cart/clear', { method: 'DELETE' });
            await fetchCart();
            sortAndRenderProducts();
            showToast('Basket cleared', 'info');
        } catch (e) {
            showToast(`Could not clear cart: ${e.message}`, 'error');
        }
    });

    // User Dropdown
    DOM.userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        DOM.userDropdown.classList.remove('show');
    });

    DOM.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Demo Accounts Quick Switches
    DOM.demoCustomerBtn.addEventListener('click', () => handleSignIn('john@example.com', 'customer123'));
    DOM.demoAdminBtn.addEventListener('click', () => handleSignIn('admin@grocery.com', 'admin123'));
    if (DOM.demoSsoCustomerBtn) {
        DOM.demoSsoCustomerBtn.addEventListener('click', () => handleSsoLogin('GOOGLE', 'alex.morgan@gmail.com', 'Alex Morgan', '+1-555-0199'));
    }

    // SSO Handlers
    if (DOM.ssoGoogleBtn) {
        DOM.ssoGoogleBtn.addEventListener('click', () => openSsoModal('GOOGLE'));
    }
    if (DOM.ssoGithubBtn) {
        DOM.ssoGithubBtn.addEventListener('click', () => handleSsoLogin('GITHUB', 'alex.dev@github.com', 'Alex Dev', '+1-555-0188'));
    }
    if (DOM.ssoQuickCustomerBtn) {
        DOM.ssoQuickCustomerBtn.addEventListener('click', () => handleSsoLogin('GOOGLE', 'alex.morgan@gmail.com', 'Alex Morgan', '+1-555-0199'));
    }
    if (DOM.closeSsoModalBtn) {
        DOM.closeSsoModalBtn.addEventListener('click', () => closeModal(DOM.ssoModal));
    }
    if (DOM.ssoAccount1) {
        DOM.ssoAccount1.addEventListener('click', () => handleSsoLogin('GOOGLE', 'alex.morgan@gmail.com', 'Alex Morgan', '+1-555-0199'));
    }
    if (DOM.ssoAccount2) {
        DOM.ssoAccount2.addEventListener('click', () => handleSsoLogin('GOOGLE', 'sarah.connor@gmail.com', 'Sarah Connor', '+1-555-0155'));
    }
    if (DOM.ssoCustomSubmitBtn) {
        DOM.ssoCustomSubmitBtn.addEventListener('click', () => {
            const email = (DOM.ssoCustomEmail && DOM.ssoCustomEmail.value.trim()) || 'custom.customer@gmail.com';
            const name = (DOM.ssoCustomName && DOM.ssoCustomName.value.trim()) || 'SSO Customer';
            handleSsoLogin('GOOGLE', email, name);
        });
    }

    DOM.fillCustomer.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginEmail').value = 'john@example.com';
        document.getElementById('loginPassword').value = 'customer123';
    });

    DOM.fillAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginEmail').value = 'admin@grocery.com';
        document.getElementById('loginPassword').value = 'admin123';
    });

    // Auth Modal
    DOM.loginBtn.addEventListener('click', () => openAuthModal('signin'));
    DOM.closeAuthModalBtn.addEventListener('click', () => closeModal(DOM.authModal));

    DOM.tabSignIn.addEventListener('click', () => switchAuthTab('signin'));
    DOM.tabSignUp.addEventListener('click', () => switchAuthTab('signup'));

    DOM.signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignIn(
            document.getElementById('loginEmail').value.trim(),
            document.getElementById('loginPassword').value
        );
    });

    DOM.signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignUp(
            document.getElementById('regFullName').value.trim(),
            document.getElementById('regEmail').value.trim(),
            document.getElementById('regPassword').value,
            document.getElementById('regPhone').value.trim()
        );
    });

    // Checkout Flow
    DOM.openCheckoutModalBtn.addEventListener('click', () => {
        if (!state.user) {
            openAuthModal('signin');
            return;
        }
        DOM.modalSummaryTotal.textContent = `$${Number(state.cart.totalAmount || 0).toFixed(2)}`;
        openModal(DOM.checkoutModal);
    });

    DOM.closeCheckoutBtn.addEventListener('click', () => closeModal(DOM.checkoutModal));
    DOM.cancelCheckoutBtn.addEventListener('click', () => closeModal(DOM.checkoutModal));
    DOM.submitOrderBtn.addEventListener('click', submitOrder);

    // Payment Option selection radio style
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // Order Success Modal
    DOM.closeSuccessModalBtn.addEventListener('click', () => closeModal(DOM.orderSuccessModal));
    DOM.continueShoppingBtn.addEventListener('click', () => closeModal(DOM.orderSuccessModal));
    DOM.viewMyOrdersBtn.addEventListener('click', () => {
        closeModal(DOM.orderSuccessModal);
        loadMyOrders();
    });

    // My Orders Modal
    DOM.myOrdersLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadMyOrders();
    });
    DOM.closeOrdersModalBtn.addEventListener('click', () => closeModal(DOM.myOrdersModal));

    // Admin Portal
    DOM.adminPortalBtn.addEventListener('click', openAdminPortal);
    DOM.adminSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminPortal();
    });
    DOM.closeAdminModalBtn.addEventListener('click', () => closeModal(DOM.adminModal));

    // Admin Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(tabId);
            if (target) target.classList.add('active');
        });
    });

    DOM.openAddProductFormBtn.addEventListener('click', () => {
        DOM.addProductForm.style.display = DOM.addProductForm.style.display === 'none' ? 'block' : 'none';
    });
    DOM.cancelAddProductBtn.addEventListener('click', () => {
        DOM.addProductForm.style.display = 'none';
    });
    DOM.newProductForm.addEventListener('submit', handleCreateProduct);
}

// ==========================================
// Modal & Drawer Helpers
// ==========================================
function openCartDrawer() {
    DOM.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    DOM.cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openAuthModal(tab = 'signin') {
    switchAuthTab(tab);
    openModal(DOM.authModal);
}

function switchAuthTab(tab) {
    if (tab === 'signin') {
        DOM.tabSignIn.classList.add('active');
        DOM.tabSignUp.classList.remove('active');
        DOM.signInForm.style.display = 'block';
        DOM.signUpForm.style.display = 'none';
    } else {
        DOM.tabSignIn.classList.remove('active');
        DOM.tabSignUp.classList.add('active');
        DOM.signInForm.style.display = 'none';
        DOM.signUpForm.style.display = 'block';
    }
}

// ==========================================
// Utility Helpers
// ==========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
}

// ==========================================
// Real-Time Top Bar, Live Clock & Marquee
// ==========================================
function initLiveClock() {
    function updateClock() {
        const now = new Date();
        if (DOM.liveClockDisplay) {
            DOM.liveClockDisplay.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        if (DOM.deliverySlotDisplay) {
            // Compute dynamic delivery window 20-45 mins from now
            const start = new Date(now.getTime() + 20 * 60000);
            const end = new Date(now.getTime() + 45 * 60000);
            const fmt = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            DOM.deliverySlotDisplay.textContent = `Next Slot: ${fmt(start)} – ${fmt(end)}`;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

function initAnnouncementMarquee() {
    const items = document.querySelectorAll('.announcement-marquee .marquee-item');
    if (!items || items.length <= 1) return;
    let idx = 0;
    setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
    }, 4500);
}

// ==========================================
// Real-Time Live Search Suggestions
// ==========================================
function initLiveSearchSuggestions() {
    if (!DOM.searchInput || !DOM.searchSuggestionsDropdown) return;

    function renderSuggestions(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            DOM.searchSuggestionsDropdown.style.display = 'none';
            return;
        }

        const matches = state.products.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        ).slice(0, 5);

        DOM.suggestionsCount.textContent = `${matches.length} found`;
        DOM.suggestionsTitle.textContent = `Matching "${q}"`;

        if (matches.length === 0) {
            DOM.suggestionsList.innerHTML = `
                <div style="padding: 14px 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                    No groceries matching "${escapeHtml(q)}". Try "Organic", "Milk", or "Bread".
                </div>
            `;
        } else {
            DOM.suggestionsList.innerHTML = matches.map(p => {
                const effPrice = (p.discountPrice && p.discountPrice < p.price) ? p.discountPrice : p.price;
                return `
                    <div class="suggestion-item" data-id="${p.id}">
                        <img class="suggestion-thumb" src="${escapeHtml(p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500')}" alt="${escapeHtml(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';">
                        <div class="suggestion-info">
                            <div class="suggestion-name">${escapeHtml(p.name)}</div>
                            <div class="suggestion-meta">
                                <span>${escapeHtml(p.categoryName || 'Grocery')}</span>
                                <span>•</span>
                                <span>${escapeHtml(p.unit || '1 unit')}</span>
                            </div>
                        </div>
                        <div class="suggestion-price">$${Number(effPrice).toFixed(2)}</div>
                        <button type="button" class="suggestion-add-btn" onclick="event.stopPropagation(); handleAddToCart(${p.id})">+ Add</button>
                    </div>
                `;
            }).join('');

            DOM.suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const prodId = item.getAttribute('data-id');
                    DOM.searchSuggestionsDropdown.style.display = 'none';
                    const targetCard = document.querySelector(`.product-card[data-id="${prodId}"]`);
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.style.boxShadow = '0 0 0 3px var(--primary)';
                        setTimeout(() => targetCard.style.boxShadow = '', 2000);
                    }
                });
            });
        }

        DOM.searchSuggestionsDropdown.style.display = 'block';
    }

    DOM.searchInput.addEventListener('input', (e) => {
        renderSuggestions(e.target.value);
    });

    DOM.searchInput.addEventListener('focus', () => {
        if (DOM.searchInput.value.trim()) {
            renderSuggestions(DOM.searchInput.value);
        }
    });

    // Popular tag chips
    document.querySelectorAll('.search-tag-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            DOM.searchInput.value = query;
            state.searchQuery = query;
            DOM.clearSearchBtn.style.display = 'block';
            loadProducts();
            DOM.searchSuggestionsDropdown.style.display = 'none';
            document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (DOM.searchContainer && !DOM.searchContainer.contains(e.target)) {
            DOM.searchSuggestionsDropdown.style.display = 'none';
        }
    });

    // Global shortcut: press '/' to focus search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            DOM.searchInput.focus();
            DOM.searchInput.select();
        } else if (e.key === 'Escape' && DOM.searchSuggestionsDropdown) {
            DOM.searchSuggestionsDropdown.style.display = 'none';
        }
    });
}

// ==========================================
// Real-Time Subnav & Department Menu
// ==========================================
function initSubnavAndDepartments() {
    if (DOM.departmentsMenuBtn && DOM.departmentsFlyoutMenu) {
        DOM.departmentsMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.departmentsFlyoutMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            DOM.departmentsFlyoutMenu.classList.remove('show');
        });
    }

    // Subnav category links
    document.querySelectorAll('.subnav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-category');
            document.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (cat === 'all') {
                filterCategoryById('all');
            } else if (cat === 'specials') {
                state.activeCategoryId = 'all';
                state.sortBy = 'price-low';
                DOM.sortSelect.value = 'price-low';
                DOM.currentCategoryTitle.textContent = '🔥 Weekly Flash Specials';
                DOM.catalogSubtitle.textContent = 'Discounted farm-fresh produce and grocery bundles';
                renderCategoryPills();
                loadProducts();
            } else {
                const found = state.categories.find(c => 
                    c.name.toLowerCase() === cat.toLowerCase() || 
                    c.name.toLowerCase().includes(cat.toLowerCase()) || 
                    cat.toLowerCase().includes(c.name.toLowerCase())
                );
                if (found) {
                    filterCategoryById(String(found.id));
                } else {
                    filterCategoryById('all');
                }
            }

            document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function renderDepartmentsFlyout() {
    if (!DOM.departmentsFlyoutMenu) return;
    let html = `
        <a class="flyout-cat-item" data-id="all">
            <span class="flyout-cat-left">
                <span>🌟</span>
                <span class="flyout-cat-name">All Departments</span>
            </span>
            <span class="flyout-cat-count">${state.products.length} items</span>
        </a>
    `;

    state.categories.forEach(cat => {
        const prodCount = state.products.filter(p => p.categoryId === cat.id).length;
        html += `
            <a class="flyout-cat-item" data-id="${cat.id}">
                <span class="flyout-cat-left">
                    <span>${cat.icon || '🥦'}</span>
                    <span class="flyout-cat-name">${escapeHtml(cat.name)}</span>
                </span>
                <span class="flyout-cat-count">${prodCount} items</span>
            </a>
        `;
    });

    DOM.departmentsFlyoutMenu.innerHTML = html;

    DOM.departmentsFlyoutMenu.querySelectorAll('.flyout-cat-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            filterCategoryById(id);
            DOM.departmentsFlyoutMenu.classList.remove('show');
            document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function filterCategoryById(catId) {
    state.activeCategoryId = String(catId);
    renderCategoryPills();

    if (catId === 'all') {
        DOM.currentCategoryTitle.textContent = 'Fresh Catalog';
        DOM.catalogSubtitle.textContent = 'Showing all farm-fresh produce and pantry staples';
    } else {
        const found = state.categories.find(c => String(c.id) === String(catId));
        DOM.currentCategoryTitle.textContent = found ? found.name : 'Category Catalog';
        DOM.catalogSubtitle.textContent = found ? (found.description || '') : '';
    }

    // Sync subnav active state
    document.querySelectorAll('.subnav-link').forEach(l => {
        const cat = l.getAttribute('data-category');
        if (catId === 'all' && cat === 'all') {
            l.classList.add('active');
        } else if (catId !== 'all') {
            const found = state.categories.find(c => String(c.id) === String(catId));
            if (found && (found.name.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(found.name.toLowerCase()))) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        } else {
            l.classList.remove('active');
        }
    });

    loadProducts();
}

// ==========================================
// Real-Time Orders Tracker & Counter
// ==========================================
async function loadMyOrdersCount() {
    if (!state.user) return;
    try {
        const orders = await apiRequest('/api/orders/user');
        state.orders = Array.isArray(orders) ? orders : [];
        updateNavTrackerCount();
    } catch (e) {
        // silent fail
    }
}

function updateNavTrackerCount() {
    if (!DOM.navTrackerCount) return;
    if (!state.user) {
        DOM.navTrackerCount.textContent = '0 Active';
        DOM.navTrackerCount.style.color = 'var(--text-muted)';
        return;
    }
    const activeOrders = state.orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PENDING' || o.status === 'PROCESSING');
    if (activeOrders.length > 0) {
        DOM.navTrackerCount.textContent = `${activeOrders.length} Active • En Route`;
        DOM.navTrackerCount.style.color = 'var(--primary-dark)';
    } else if (state.orders.length > 0) {
        DOM.navTrackerCount.textContent = `${state.orders.length} Past Orders`;
        DOM.navTrackerCount.style.color = 'var(--text-muted)';
    } else {
        DOM.navTrackerCount.textContent = '0 Active';
        DOM.navTrackerCount.style.color = 'var(--text-muted)';
    }
}

// ==========================================
// Real-Time Sitemap & Footer Interactivity
// ==========================================
function initSitemapInteractivity() {
    // Sitemap category navigation links
    document.querySelectorAll('.sitemap-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-cat');
            if (cat === 'all') {
                filterCategoryById('all');
            } else {
                const found = state.categories.find(c => 
                    c.name.toLowerCase() === cat.toLowerCase() || 
                    c.name.toLowerCase().includes(cat.toLowerCase()) ||
                    cat.toLowerCase().includes(c.name.toLowerCase())
                );
                if (found) {
                    filterCategoryById(String(found.id));
                } else {
                    filterCategoryById('all');
                }
            }
            document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Sitemap Order & Account Links
    if (DOM.sitemapTrackOrderLink) {
        DOM.sitemapTrackOrderLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (!state.user) {
                openAuthModal('signin');
            } else {
                loadMyOrders();
            }
        });
    }

    if (DOM.sitemapMyOrdersLink) {
        DOM.sitemapMyOrdersLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (!state.user) {
                openAuthModal('signin');
            } else {
                loadMyOrders();
            }
        });
    }

    if (DOM.sitemapOpenCartLink) {
        DOM.sitemapOpenCartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    if (DOM.sitemapAddressesLink) {
        DOM.sitemapAddressesLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentAddr = (state.user && state.user.address) || 'Downtown, 5th Ave';
            showToast(`📍 Default Delivery Address: ${currentAddr}. You can change this anytime during checkout.`, 'info');
        });
    }

    // Policy informational toasts
    document.querySelectorAll('.sitemap-info-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const infoType = link.getAttribute('data-info');
            if (infoType === 'delivery') {
                showToast('🚀 Express Dispatch: Hyperlocal delivery across 15-mile radius within 15-30 minutes.', 'info');
            } else if (infoType === 'refund') {
                showToast('🔄 100% Quality Guarantee: Any produce issues are refunded immediately with zero hassle.', 'success');
            } else if (infoType === 'organic') {
                showToast('🌱 Organic Standard: Direct farm-gate contracts with certified non-GMO, organic growers.', 'success');
            } else if (infoType === 'help') {
                showToast('❓ 24/7 Support Hotline: 1-800-FRESH-GROCERY or email support@freshharvest.com', 'info');
            } else if (infoType === 'privacy') {
                showToast('🔒 Privacy: Your data is protected by Spring Cloud Gateway and JJWT tokens.', 'info');
            } else if (infoType === 'terms') {
                showToast('📜 FreshHarvest terms of service active. Microservices cluster rate-limiting enabled.', 'info');
            }
        });
    });

    // Newsletter Form
    if (DOM.newsletterForm) {
        DOM.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = DOM.newsletterEmail ? DOM.newsletterEmail.value.trim() : '';
            if (email) {
                showToast(`🎉 Success! Welcome to FreshHarvest Insider. Use code FRESH10 for $10 OFF!`, 'success');
                DOM.newsletterForm.reset();
            }
        });
    }

    // Back to top button
    if (DOM.backToTopBtn) {
        DOM.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Location Picker button in nav
    if (DOM.locationPickerBtn) {
        const locations = ['Downtown, 5th Ave', 'Westside, Elm St', 'Midtown, Park Ave', 'North Bay, Marina', 'Uptown, Broadway'];
        let locIndex = 0;
        DOM.locationPickerBtn.addEventListener('click', () => {
            locIndex = (locIndex + 1) % locations.length;
            const newLoc = locations[locIndex];
            if (DOM.selectedAddressLabel) {
                DOM.selectedAddressLabel.textContent = `${newLoc} ▾`;
            }
            showToast(`📍 Delivery location updated to: ${newLoc}`, 'info');
        });
    }

    // Navbar Order Tracker Button
    if (DOM.navOrderTrackerBtn) {
        DOM.navOrderTrackerBtn.addEventListener('click', () => {
            if (!state.user) {
                openAuthModal('signin');
            } else {
                loadMyOrders();
            }
        });
    }
}

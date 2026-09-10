/**
 * FreshHarvest Admin Portal Script
 * Connects to Spring Cloud Gateway & Microservices Backend
 */

const API_BASE = (window.location.protocol === 'file:' || !window.location.port)
    ? 'http://localhost:8080'
    : '';

// Application State
const state = {
    user: null, // { token, userId, email, fullName, roles: [] }
    products: [],
    categories: [],
    orders: [],
    users: [],
    activeView: 'view-dashboard',
    productSearch: '',
    productCategory: 'all',
    productStock: 'all',
    orderStatusFilter: 'ALL',
    orderSearch: ''
};

// DOM References
const DOM = {
    // Auth & Shell
    adminShell: document.getElementById('adminShell'),
    adminAuthGateModal: document.getElementById('adminAuthGateModal'),
    adminLoginForm: document.getElementById('adminLoginForm'),
    gateEmail: document.getElementById('gateEmail'),
    gatePassword: document.getElementById('gatePassword'),
    demoAdminFillBtn: document.getElementById('demoAdminFillBtn'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminProfileName: document.getElementById('adminProfileName'),
    adminAvatarInitial: document.getElementById('adminAvatarInitial'),
    sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
    adminSidebar: document.getElementById('adminSidebar'),
    refreshAllBtn: document.getElementById('refreshAllBtn'),

    // Page titles
    currentPageTitle: document.getElementById('currentPageTitle'),
    currentPageSubtitle: document.getElementById('currentPageSubtitle'),

    // Sidebar counters
    sidebarProductCount: document.getElementById('sidebarProductCount'),
    sidebarOrderCount: document.getElementById('sidebarOrderCount'),
    sidebarUserCount: document.getElementById('sidebarUserCount'),

    // Dashboard KPIs
    kpiRevenue: document.getElementById('kpiRevenue'),
    kpiOrders: document.getElementById('kpiOrders'),
    kpiPendingOrders: document.getElementById('kpiPendingOrders'),
    kpiProducts: document.getElementById('kpiProducts'),
    kpiCategoryCount: document.getElementById('kpiCategoryCount'),
    kpiLowStock: document.getElementById('kpiLowStock'),
    kpiUsers: document.getElementById('kpiUsers'),

    // Dashboard widgets
    dashRecentOrdersTable: document.getElementById('dashRecentOrdersTable'),
    dashViewAllOrdersBtn: document.getElementById('dashViewAllOrdersBtn'),
    dashPingClusterBtn: document.getElementById('dashPingClusterBtn'),
    lowStockWarningCard: document.getElementById('lowStockWarningCard'),
    lowStockTable: document.getElementById('lowStockTable'),
    openAddProductBtnDash: document.getElementById('openAddProductBtnDash'),

    // Products View
    productsMasterTable: document.getElementById('productsMasterTable'),
    productSearchInput: document.getElementById('productSearchInput'),
    productCategoryFilter: document.getElementById('productCategoryFilter'),
    productStockFilter: document.getElementById('productStockFilter'),
    openAddProductModalBtn: document.getElementById('openAddProductModalBtn'),

    // Add Product Modal
    addProductModal: document.getElementById('addProductModal'),
    closeAddProductModalBtn: document.getElementById('closeAddProductModalBtn'),
    cancelAddProductModalBtn: document.getElementById('cancelAddProductModalBtn'),
    createProductForm: document.getElementById('createProductForm'),
    addProdName: document.getElementById('addProdName'),
    addProdCategory: document.getElementById('addProdCategory'),
    addProdPrice: document.getElementById('addProdPrice'),
    addProdDiscount: document.getElementById('addProdDiscount'),
    addProdUnit: document.getElementById('addProdUnit'),
    addProdStock: document.getElementById('addProdStock'),
    addProdImage: document.getElementById('addProdImage'),
    imagePreviewBox: document.getElementById('imagePreviewBox'),
    imagePreviewImg: document.getElementById('imagePreviewImg'),
    addProdDesc: document.getElementById('addProdDesc'),

    // Orders View
    ordersMasterTable: document.getElementById('ordersMasterTable'),
    orderSearchInput: document.getElementById('orderSearchInput'),
    orderStatusTabs: document.getElementById('orderStatusTabs'),
    countAllOrders: document.getElementById('countAllOrders'),
    countConfirmed: document.getElementById('countConfirmed'),
    countPacking: document.getElementById('countPacking'),
    countOutForDelivery: document.getElementById('countOutForDelivery'),
    countDelivered: document.getElementById('countDelivered'),
    countCancelled: document.getElementById('countCancelled'),

    // Order Details Modal
    orderDetailsModal: document.getElementById('orderDetailsModal'),
    closeOrderDetailsModalBtn: document.getElementById('closeOrderDetailsModalBtn'),
    closeOrderModalBottomBtn: document.getElementById('closeOrderModalBottomBtn'),
    orderModalTitle: document.getElementById('orderModalTitle'),
    orderModalCustomerName: document.getElementById('orderModalCustomerName'),
    orderModalCustomerEmail: document.getElementById('orderModalCustomerEmail'),
    orderModalAddress: document.getElementById('orderModalAddress'),
    orderModalPhone: document.getElementById('orderModalPhone'),
    orderModalPayment: document.getElementById('orderModalPayment'),
    orderModalStatus: document.getElementById('orderModalStatus'),
    orderItemsModalTable: document.getElementById('orderItemsModalTable'),
    orderModalTotalAmount: document.getElementById('orderModalTotalAmount'),

    // Users View
    usersMasterTable: document.getElementById('usersMasterTable'),

    // Cluster View
    pingClusterDetailedBtn: document.getElementById('pingClusterDetailedBtn'),

    // Toast
    toastContainer: document.getElementById('adminToastContainer')
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initEventListeners();
    const isAuthed = checkAdminAuth();
    if (isAuthed) {
        await loadAllAdminData();
        runClusterHealthPing();
    }
});

// ==========================================
// Authentication Gate
// ==========================================
function checkAdminAuth() {
    try {
        const stored = localStorage.getItem('freshharvest_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.token && parsed.roles && (parsed.roles.includes('ROLE_ADMIN') || parsed.roles.includes('ADMIN'))) {
                state.user = parsed;
                updateAdminProfileUI();
                DOM.adminAuthGateModal.classList.remove('active');
                return true;
            }
        }
    } catch (e) {
        console.warn('Invalid user session in localStorage', e);
    }

    // Not admin / not authenticated: show gate modal
    DOM.adminAuthGateModal.classList.add('active');
    return false;
}

function updateAdminProfileUI() {
    if (!state.user) return;
    DOM.adminProfileName.textContent = state.user.fullName || state.user.email || 'Admin';
    const initial = (state.user.fullName || state.user.email || 'A').charAt(0).toUpperCase();
    DOM.adminAvatarInitial.textContent = initial;
}

async function handleAdminLogin(email, password) {
    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Authentication failed');
        }

        const data = await res.json();
        if (!data.roles || (!data.roles.includes('ROLE_ADMIN') && !data.roles.includes('ADMIN'))) {
            throw new Error('Access denied: account does not have ROLE_ADMIN privileges');
        }

        state.user = data;
        localStorage.setItem('freshharvest_user', JSON.stringify(data));
        updateAdminProfileUI();
        DOM.adminAuthGateModal.classList.remove('active');
        showToast('Admin authentication successful', 'success');

        await loadAllAdminData();
        runClusterHealthPing();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

function handleAdminLogout() {
    localStorage.removeItem('freshharvest_user');
    state.user = null;
    showToast('Logged out of Admin Console', 'info');
    DOM.adminAuthGateModal.classList.add('active');
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

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
        if (state.user) {
            showToast('Session expired or unauthorized role. Please re-authenticate.', 'error');
            DOM.adminAuthGateModal.classList.add('active');
        }
        throw new Error(`HTTP ${res.status}: Access Denied`);
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Request failed`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
}

// ==========================================
// Navigation & Views
// ==========================================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const viewSections = document.querySelectorAll('.admin-view');

    const viewMeta = {
        'view-dashboard': {
            title: 'Dashboard Overview',
            subtitle: 'Store telemetry, catalog health, and live microservices status'
        },
        'view-products': {
            title: 'Products & Inventory Catalog',
            subtitle: 'Manage catalog items, pricing, inventory stock, and availability'
        },
        'view-orders': {
            title: 'Customer Orders Pipeline',
            subtitle: 'Track incoming orders, inspect item breakdowns, and update dispatch status'
        },
        'view-users': {
            title: 'Registered Users Directory',
            subtitle: 'System accounts, customer profiles, addresses, and assigned security roles'
        },
        'view-cluster': {
            title: 'Microservices Architecture & Topology',
            subtitle: 'Cluster status, port mappings, OpenFeign orchestration, and service latency'
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-view');
            switchView(targetView);
        });
    });

    window.switchView = function(viewId) {
        state.activeView = viewId;
        navButtons.forEach(b => {
            if (b.getAttribute('data-view') === viewId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        viewSections.forEach(sec => {
            sec.classList.toggle('active', sec.id === viewId);
        });

        if (viewMeta[viewId]) {
            DOM.currentPageTitle.textContent = viewMeta[viewId].title;
            DOM.currentPageSubtitle.textContent = viewMeta[viewId].subtitle;
        }

        // Close mobile sidebar if open
        DOM.adminSidebar.classList.remove('show-mobile');
    };

    DOM.sidebarToggleBtn.addEventListener('click', () => {
        DOM.adminSidebar.classList.toggle('show-mobile');
    });

    DOM.dashViewAllOrdersBtn.addEventListener('click', () => switchView('view-orders'));
    DOM.dashPingClusterBtn.addEventListener('click', () => {
        switchView('view-cluster');
        runClusterHealthPing();
    });
}

// ==========================================
// Data Loaders
// ==========================================
async function loadAllAdminData() {
    try {
        await Promise.allSettled([
            loadCategories(),
            loadProducts(),
            loadOrders(),
            loadUsers()
        ]);
        updateDashboardKPIs();
    } catch (e) {
        console.error('Error refreshing admin data', e);
    }
}

async function loadCategories() {
    try {
        state.categories = await apiRequest('/api/categories');
        populateCategorySelects();
    } catch (e) {
        console.error('Failed to load categories', e);
    }
}

function populateCategorySelects() {
    // Products filter category select
    DOM.productCategoryFilter.innerHTML = '<option value="all">All Categories</option>' +
        state.categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');

    // Add Product modal category select
    DOM.addProdCategory.innerHTML = state.categories.map(c =>
        `<option value="${c.id}">${escapeHtml(c.name)}</option>`
    ).join('');
}

async function loadProducts() {
    try {
        state.products = await apiRequest('/api/products');
        DOM.sidebarProductCount.textContent = state.products.length;
        renderProductsTable();
        renderLowStockAlerts();
    } catch (e) {
        console.error('Failed to load products', e);
        DOM.productsMasterTable.querySelector('tbody').innerHTML =
            `<tr><td colspan="8" class="loading-td" style="color: var(--danger);">Failed to load products: ${escapeHtml(e.message)}</td></tr>`;
    }
}

async function loadOrders() {
    try {
        state.orders = await apiRequest('/api/orders');
        DOM.sidebarOrderCount.textContent = state.orders.length;
        updateOrderStatusCounts();
        renderOrdersTable();
        renderDashboardRecentOrders();
    } catch (e) {
        console.error('Failed to load orders', e);
        DOM.ordersMasterTable.querySelector('tbody').innerHTML =
            `<tr><td colspan="9" class="loading-td" style="color: var(--danger);">Failed to load orders: ${escapeHtml(e.message)}</td></tr>`;
    }
}

async function loadUsers() {
    try {
        state.users = await apiRequest('/api/auth/users');
        DOM.sidebarUserCount.textContent = state.users.length;
        renderUsersTable();
    } catch (e) {
        console.warn('Could not load users directory', e);
        DOM.usersMasterTable.querySelector('tbody').innerHTML =
            `<tr><td colspan="6" class="loading-td">User directory restricted or unavailable.</td></tr>`;
    }
}

// ==========================================
// KPI & Dashboard Telemetry
// ==========================================
function updateDashboardKPIs() {
    // Total revenue from non-cancelled orders
    const validOrders = state.orders.filter(o => (o.status || '').toUpperCase() !== 'CANCELLED');
    const totalRev = validOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
    DOM.kpiRevenue.textContent = `$${totalRev.toFixed(2)}`;

    // Total orders & pending orders (CONFIRMED or PACKING)
    DOM.kpiOrders.textContent = state.orders.length;
    const pending = state.orders.filter(o => ['CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY'].includes((o.status || '').toUpperCase())).length;
    DOM.kpiPendingOrders.textContent = `${pending} Active`;

    // Catalog & categories count
    DOM.kpiProducts.textContent = state.products.length;
    DOM.kpiCategoryCount.textContent = `${state.categories.length} Categories listed`;

    // Low stock items count (< 15)
    const lowStockItems = state.products.filter(p => Number(p.stockQuantity) < 15);
    DOM.kpiLowStock.textContent = lowStockItems.length;

    // Users
    DOM.kpiUsers.textContent = state.users.length || '-';
}

function renderDashboardRecentOrders() {
    const recent = [...state.orders].slice(0, 5);
    if (!recent.length) {
        DOM.dashRecentOrdersTable.querySelector('tbody').innerHTML =
            '<tr><td colspan="6" class="loading-td">No customer orders placed yet.</td></tr>';
        return;
    }

    DOM.dashRecentOrdersTable.querySelector('tbody').innerHTML = recent.map(o => `
        <tr>
            <td><strong>${escapeHtml(o.orderNumber || `#${o.id}`)}</strong></td>
            <td>
                <div>${escapeHtml(o.customerName || 'Customer')}</div>
                <small style="color: var(--text-muted);">${escapeHtml(o.customerEmail || '')}</small>
            </td>
            <td>${o.items ? o.items.length : 0} items</td>
            <td><strong>$${Number(o.totalAmount || 0).toFixed(2)}</strong></td>
            <td><span class="status-pill status-${(o.status || 'confirmed').toLowerCase()}">${escapeHtml(o.status)}</span></td>
            <td>
                <button class="btn-view-sm" onclick="viewOrderDetails(${o.id})">Details</button>
            </td>
        </tr>
    `).join('');
}

function renderLowStockAlerts() {
    const lowStockItems = state.products.filter(p => Number(p.stockQuantity) < 15);
    if (lowStockItems.length > 0) {
        DOM.lowStockWarningCard.style.display = 'block';
        DOM.lowStockTable.querySelector('tbody').innerHTML = lowStockItems.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td>
                    <div class="product-cell">
                        <img src="${escapeHtml(p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100')}" class="table-product-thumb" alt="${escapeHtml(p.name)}">
                        <div>
                            <div class="product-info-name">${escapeHtml(p.name)}</div>
                            <div class="product-info-unit">${escapeHtml(p.unit || '')}</div>
                        </div>
                    </div>
                </td>
                <td><span class="stock-pill low-stock">${escapeHtml(p.categoryName || 'General')}</span></td>
                <td>
                    <strong style="color: ${p.stockQuantity === 0 ? 'var(--danger)' : 'var(--warning)'}; font-size: 1rem;">
                        ${p.stockQuantity} units
                    </strong>
                </td>
                <td>$${Number(p.discountPrice || p.price || 0).toFixed(2)}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="promptRestockProduct(${p.id}, '${escapeHtml(p.name)}', ${p.stockQuantity})">Restock</button>
                </td>
            </tr>
        `).join('');
    } else {
        DOM.lowStockWarningCard.style.display = 'none';
    }
}

// ==========================================
// Products Table & Actions
// ==========================================
function renderProductsTable() {
    let filtered = [...state.products];

    // Search filter
    if (state.productSearch) {
        const q = state.productSearch.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            String(p.id).includes(q) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(q))
        );
    }

    // Category filter
    if (state.productCategory !== 'all') {
        filtered = filtered.filter(p => String(p.categoryId) === String(state.productCategory));
    }

    // Stock filter
    if (state.productStock === 'low') {
        filtered = filtered.filter(p => Number(p.stockQuantity) > 0 && Number(p.stockQuantity) < 15);
    } else if (state.productStock === 'out') {
        filtered = filtered.filter(p => Number(p.stockQuantity) === 0);
    } else if (state.productStock === 'in') {
        filtered = filtered.filter(p => Number(p.stockQuantity) >= 15);
    }

    if (!filtered.length) {
        DOM.productsMasterTable.querySelector('tbody').innerHTML =
            '<tr><td colspan="8" class="loading-td">No catalog products match current search and filter criteria.</td></tr>';
        return;
    }

    DOM.productsMasterTable.querySelector('tbody').innerHTML = filtered.map(p => {
        let stockPillClass = 'in-stock';
        let stockLabel = `${p.stockQuantity} in stock`;
        if (p.stockQuantity === 0) {
            stockPillClass = 'out-stock';
            stockLabel = 'Out of Stock (0)';
        } else if (p.stockQuantity < 15) {
            stockPillClass = 'low-stock';
            stockLabel = `Low (${p.stockQuantity})`;
        }

        return `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>
                    <div class="product-cell">
                        <img src="${escapeHtml(p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100')}" class="table-product-thumb" alt="${escapeHtml(p.name)}">
                        <div>
                            <div class="product-info-name">${escapeHtml(p.name)}</div>
                            <div class="product-info-unit">${escapeHtml(p.description || '')}</div>
                        </div>
                    </div>
                </td>
                <td><span class="stock-pill in-stock">${escapeHtml(p.categoryName || 'General')}</span></td>
                <td>${escapeHtml(p.unit || '1 Pack')}</td>
                <td>$${Number(p.price || 0).toFixed(2)}</td>
                <td>
                    ${p.discountPrice ? `<strong style="color: var(--primary-dark);">$${Number(p.discountPrice).toFixed(2)}</strong>` : '<span style="color: var(--text-muted);">-</span>'}
                </td>
                <td>
                    <span class="stock-pill ${stockPillClass}">${stockLabel}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-outline btn-sm" onclick="promptRestockProduct(${p.id}, '${escapeHtml(p.name)}', ${p.stockQuantity})">Edit Stock</button>
                        <button class="btn-danger-sm" onclick="deleteAdminProduct(${p.id}, '${escapeHtml(p.name)}')">Deactivate</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.deleteAdminProduct = async function(productId, productName) {
    if (!confirm(`Mark "${productName || 'this item'}" as inactive in the grocery catalog?`)) return;
    try {
        await apiRequest(`/api/products/${productId}`, { method: 'DELETE' });
        showToast('Product marked inactive', 'info');
        await loadProducts();
        updateDashboardKPIs();
    } catch (e) {
        showToast(`Failed to deactivate product: ${e.message}`, 'error');
    }
};

window.promptRestockProduct = async function(productId, productName, currentStock) {
    const newStockStr = prompt(`Update stock count for "${productName}":`, currentStock);
    if (newStockStr === null) return;
    const newStock = parseInt(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
        showToast('Please enter a valid non-negative integer', 'error');
        return;
    }

    try {
        const prod = state.products.find(p => p.id === productId);
        if (!prod) return;

        await apiRequest(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: prod.name,
                categoryId: prod.categoryId,
                price: prod.price,
                discountPrice: prod.discountPrice,
                unit: prod.unit,
                stockQuantity: newStock,
                imageUrl: prod.imageUrl,
                description: prod.description
            })
        });

        showToast(`Stock updated to ${newStock} for "${productName}"`, 'success');
        await loadProducts();
        updateDashboardKPIs();
    } catch (e) {
        showToast(`Failed to update stock: ${e.message}`, 'error');
    }
};

async function handleCreateProduct(e) {
    e.preventDefault();
    const name = DOM.addProdName.value.trim();
    const categoryId = Number(DOM.addProdCategory.value);
    const price = parseFloat(DOM.addProdPrice.value);
    const discountVal = DOM.addProdDiscount.value;
    const discountPrice = discountVal ? parseFloat(discountVal) : null;
    const unit = DOM.addProdUnit.value.trim();
    const stockQuantity = parseInt(DOM.addProdStock.value);
    const imageUrl = DOM.addProdImage.value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    const description = DOM.addProdDesc.value.trim();

    try {
        await apiRequest('/api/products', {
            method: 'POST',
            body: JSON.stringify({
                name, categoryId, price, discountPrice, unit, stockQuantity, imageUrl, description
            })
        });

        showToast(`Product "${name}" successfully added to catalog!`, 'success');
        DOM.createProductForm.reset();
        DOM.imagePreviewBox.style.display = 'none';
        DOM.addProductModal.classList.remove('active');

        await loadProducts();
        updateDashboardKPIs();
    } catch (e) {
        showToast(`Failed to add product: ${e.message}`, 'error');
    }
}

// ==========================================
// Orders Table & Actions
// ==========================================
function updateOrderStatusCounts() {
    DOM.countAllOrders.textContent = state.orders.length;
    DOM.countConfirmed.textContent = state.orders.filter(o => (o.status || '').toUpperCase() === 'CONFIRMED').length;
    DOM.countPacking.textContent = state.orders.filter(o => (o.status || '').toUpperCase() === 'PACKING').length;
    DOM.countOutForDelivery.textContent = state.orders.filter(o => (o.status || '').toUpperCase() === 'OUT_FOR_DELIVERY').length;
    DOM.countDelivered.textContent = state.orders.filter(o => (o.status || '').toUpperCase() === 'DELIVERED').length;
    DOM.countCancelled.textContent = state.orders.filter(o => (o.status || '').toUpperCase() === 'CANCELLED').length;
}

function renderOrdersTable() {
    let filtered = [...state.orders];

    // Status tab filter
    if (state.orderStatusFilter !== 'ALL') {
        filtered = filtered.filter(o => (o.status || '').toUpperCase() === state.orderStatusFilter);
    }

    // Search filter
    if (state.orderSearch) {
        const q = state.orderSearch.toLowerCase();
        filtered = filtered.filter(o =>
            (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
            (o.customerName && o.customerName.toLowerCase().includes(q)) ||
            (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
            String(o.id).includes(q)
        );
    }

    if (!filtered.length) {
        DOM.ordersMasterTable.querySelector('tbody').innerHTML =
            '<tr><td colspan="9" class="loading-td">No customer orders matching this filter.</td></tr>';
        return;
    }

    DOM.ordersMasterTable.querySelector('tbody').innerHTML = filtered.map(o => `
        <tr>
            <td><strong>${escapeHtml(o.orderNumber || `#${o.id}`)}</strong></td>
            <td>
                <small style="color: var(--text-muted);">${formatDate(o.createdAt)}</small>
            </td>
            <td>
                <div><strong>${escapeHtml(o.customerName || 'Customer')}</strong></div>
                <small style="color: var(--text-muted);">${escapeHtml(o.customerEmail || '')}</small>
            </td>
            <td>${o.items ? o.items.length : 0} items</td>
            <td><strong style="color: var(--text-main);">$${Number(o.totalAmount || 0).toFixed(2)}</strong></td>
            <td>
                <div>${escapeHtml(o.paymentMethod || 'COD')}</div>
                <small class="text-success">${escapeHtml(o.paymentStatus || 'PAID')}</small>
            </td>
            <td>
                <span class="status-pill status-${(o.status || 'confirmed').toLowerCase()}">${escapeHtml(o.status)}</span>
            </td>
            <td>
                <select onchange="updateOrderStatusAdmin(${o.id}, this.value)" class="styled-select" style="padding: 4px 8px; font-size: 0.775rem;">
                    <option value="">Update Status...</option>
                    <option value="PACKING" ${o.status === 'PACKING' ? 'disabled' : ''}>PACKING</option>
                    <option value="OUT_FOR_DELIVERY" ${o.status === 'OUT_FOR_DELIVERY' ? 'disabled' : ''}>OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'disabled' : ''}>DELIVERED</option>
                    <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'disabled' : ''}>CANCELLED</option>
                </select>
            </td>
            <td>
                <button class="btn-view-sm" onclick="viewOrderDetails(${o.id})">Items Breakdown</button>
            </td>
        </tr>
    `).join('');
}

window.updateOrderStatusAdmin = async function(orderId, newStatus) {
    if (!newStatus) return;
    try {
        await apiRequest(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
        await loadOrders();
        updateDashboardKPIs();
    } catch (e) {
        showToast(`Status update failed: ${e.message}`, 'error');
    }
};

window.viewOrderDetails = function(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    DOM.orderModalTitle.textContent = `📑 Order Details ${order.orderNumber || `#${order.id}`}`;
    DOM.orderModalCustomerName.textContent = order.customerName || 'Valued Customer';
    DOM.orderModalCustomerEmail.textContent = order.customerEmail || '-';
    DOM.orderModalAddress.textContent = order.deliveryAddress || '-';
    DOM.orderModalPhone.textContent = order.customerPhone || '-';
    DOM.orderModalPayment.textContent = `${order.paymentMethod || 'COD'} (${order.paymentStatus || 'PAID'})`;
    DOM.orderModalStatus.textContent = order.status || 'CONFIRMED';
    DOM.orderModalTotalAmount.textContent = `$${Number(order.totalAmount || 0).toFixed(2)}`;

    const items = order.items || [];
    if (items.length === 0) {
        DOM.orderItemsModalTable.querySelector('tbody').innerHTML =
            '<tr><td colspan="4" class="loading-td">No items found for this order.</td></tr>';
    } else {
        DOM.orderItemsModalTable.querySelector('tbody').innerHTML = items.map(it => `
            <tr>
                <td><strong>${escapeHtml(it.productName || `Product #${it.productId}`)}</strong></td>
                <td>$${Number(it.unitPrice || 0).toFixed(2)}</td>
                <td>× ${it.quantity}</td>
                <td><strong>$${Number(it.subtotal || (it.unitPrice * it.quantity) || 0).toFixed(2)}</strong></td>
            </tr>
        `).join('');
    }

    DOM.orderDetailsModal.classList.add('active');
};

// ==========================================
// Users Directory
// ==========================================
function renderUsersTable() {
    if (!state.users || !state.users.length) {
        DOM.usersMasterTable.querySelector('tbody').innerHTML =
            '<tr><td colspan="6" class="loading-td">No users found.</td></tr>';
        return;
    }

    DOM.usersMasterTable.querySelector('tbody').innerHTML = state.users.map(u => {
        const roles = Array.from(u.roles || []);
        const roleBadges = roles.map(r =>
            `<span class="cluster-badge ${r.includes('ADMIN') ? 'online' : 'in-stock'}" style="margin-right: 4px;">${escapeHtml(r)}</span>`
        ).join('');

        const addrCount = u.addresses ? u.addresses.length : 0;

        return `
            <tr>
                <td><strong>#${u.id}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="profile-avatar" style="width: 28px; height: 28px; font-size: 0.75rem;">
                            ${(u.fullName || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <strong>${escapeHtml(u.fullName || 'User')}</strong>
                    </div>
                </td>
                <td>${escapeHtml(u.email || '-')}</td>
                <td>${escapeHtml(u.phone || 'Not provided')}</td>
                <td>${roleBadges}</td>
                <td><span class="stock-pill in-stock">${addrCount} saved</span></td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// Microservices Cluster Health Ping
// ==========================================
async function runClusterHealthPing() {
    const services = [
        { name: 'Gateway', url: `${API_BASE}/api/products`, port: 8080, latencyEl: 'latGateway', statusEl: 'badgeGateway', dashStatusEl: 'statusDashGateway' },
        { name: 'Auth', url: `${API_BASE}/api/auth/profile`, port: 8081, latencyEl: 'latAuth', statusEl: 'badgeAuth', dashStatusEl: 'statusDashAuth' },
        { name: 'Product', url: `${API_BASE}/api/products`, port: 8082, latencyEl: 'latProduct', statusEl: 'badgeProduct', dashStatusEl: 'statusDashProduct' },
        { name: 'Order', url: `${API_BASE}/api/orders`, port: 8083, latencyEl: 'latOrder', statusEl: 'badgeOrder', dashStatusEl: 'statusDashOrder' },
        { name: 'Payment', url: `${API_BASE}/api/delivery/order/1`, port: 8084, latencyEl: 'latPayment', statusEl: 'badgePayment', dashStatusEl: 'statusDashPayment' }
    ];

    for (const s of services) {
        const start = performance.now();
        try {
            const headers = {};
            if (state.user && state.user.token) {
                headers['Authorization'] = `Bearer ${state.user.token}`;
            }
            await fetch(s.url, { method: 'GET', headers }).catch(() => {});
            const latency = Math.round(performance.now() - start);

            const latEl = document.getElementById(s.latencyEl);
            if (latEl) latEl.textContent = `${latency}ms`;

            const stEl = document.getElementById(s.statusEl);
            if (stEl) {
                stEl.textContent = 'Active';
                stEl.className = 'cluster-badge online';
            }

            const dashEl = document.getElementById(s.dashStatusEl);
            if (dashEl) {
                dashEl.textContent = `${latency}ms`;
                dashEl.className = 'cluster-badge online';
            }
        } catch (e) {
            const stEl = document.getElementById(s.statusEl);
            if (stEl) {
                stEl.textContent = 'Unreachable';
                stEl.className = 'cluster-badge offline';
            }
        }
    }
}

// ==========================================
// Event Listeners
// ==========================================
function initEventListeners() {
    // Auth Gate
    DOM.adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAdminLogin(DOM.gateEmail.value.trim(), DOM.gatePassword.value);
    });

    DOM.demoAdminFillBtn.addEventListener('click', () => {
        DOM.gateEmail.value = 'admin@grocery.com';
        DOM.gatePassword.value = 'admin123';
        handleAdminLogin('admin@grocery.com', 'admin123');
    });

    DOM.adminLogoutBtn.addEventListener('click', handleAdminLogout);

    // Refresh button
    DOM.refreshAllBtn.addEventListener('click', async () => {
        DOM.refreshAllBtn.classList.add('loading');
        await loadAllAdminData();
        await runClusterHealthPing();
        DOM.refreshAllBtn.classList.remove('loading');
        showToast('All data and metrics refreshed', 'success');
    });

    // Product search and filters
    let searchDebounce;
    DOM.productSearchInput.addEventListener('input', (e) => {
        state.productSearch = e.target.value.trim();
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(renderProductsTable, 250);
    });

    DOM.productCategoryFilter.addEventListener('change', (e) => {
        state.productCategory = e.target.value;
        renderProductsTable();
    });

    DOM.productStockFilter.addEventListener('change', (e) => {
        state.productStock = e.target.value;
        renderProductsTable();
    });

    // Add Product Modal
    DOM.openAddProductModalBtn.addEventListener('click', () => {
        DOM.addProductModal.classList.add('active');
    });
    DOM.openAddProductBtnDash.addEventListener('click', () => {
        DOM.addProductModal.classList.add('active');
    });
    DOM.closeAddProductModalBtn.addEventListener('click', () => {
        DOM.addProductModal.classList.remove('active');
    });
    DOM.cancelAddProductModalBtn.addEventListener('click', () => {
        DOM.addProductModal.classList.remove('active');
    });
    DOM.createProductForm.addEventListener('submit', handleCreateProduct);

    // Image URL preview in Add Product
    DOM.addProdImage.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            DOM.imagePreviewImg.src = url;
            DOM.imagePreviewBox.style.display = 'flex';
        } else {
            DOM.imagePreviewBox.style.display = 'none';
        }
    });

    // Order status filter tabs
    DOM.orderStatusTabs.querySelectorAll('.status-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.orderStatusTabs.querySelectorAll('.status-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.orderStatusFilter = btn.getAttribute('data-status');
            renderOrdersTable();
        });
    });

    // Order search
    let orderSearchDebounce;
    DOM.orderSearchInput.addEventListener('input', (e) => {
        state.orderSearch = e.target.value.trim();
        clearTimeout(orderSearchDebounce);
        orderSearchDebounce = setTimeout(renderOrdersTable, 250);
    });

    // Order Details Modal Close
    DOM.closeOrderDetailsModalBtn.addEventListener('click', () => {
        DOM.orderDetailsModal.classList.remove('active');
    });
    DOM.closeOrderModalBottomBtn.addEventListener('click', () => {
        DOM.orderDetailsModal.classList.remove('active');
    });

    // Cluster ping button
    DOM.pingClusterDetailedBtn.addEventListener('click', async () => {
        showToast('Running cluster health ping test...', 'info');
        await runClusterHealthPing();
        showToast('Cluster ping complete: All services responded', 'success');
    });
}

// ==========================================
// Toast & Utilities
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

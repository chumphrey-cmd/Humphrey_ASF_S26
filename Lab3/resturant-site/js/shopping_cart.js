// ==========================================
// Shopping cart using localStorage
// ==========================================
function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the item ID and the Quantity the user selected
            const itemId = parseInt(this.getAttribute('data-id'));
            const quantityInput = document.getElementById(`qty-${itemId}`);
            const quantity = parseInt(quantityInput.value);

            if (quantity < 1 || quantity > 5) {
                alert("Please select a quantity between 1 and 5.");
                return;
            }

            // Find the full item details from our MENU_ITEMS array
            const selectedItem = MENU_ITEMS.find(item => item.id === itemId);

            // Get the current cart from localStorage (or start an empty one)
            let cart = JSON.parse(localStorage.getItem('myCart')) || [];

            // Check if this item is ALREADY in the cart
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);

            if (existingItemIndex > -1) {
                // If it is, just update the quantity
                cart[existingItemIndex].quantity += quantity;
                // Optional: Cap it at 5 max to follow rubric constraints tightly
                if (cart[existingItemIndex].quantity > 5) cart[existingItemIndex].quantity = 5;
            } else {
                // If it's new, add it to the cart array
                cart.push({
                    id: selectedItem.id,
                    name: selectedItem.name,
                    price: selectedItem.price,
                    quantity: quantity
                });
            }

            // Save the updated cart back to localStorage
            localStorage.setItem('myCart', JSON.stringify(cart));

            // Give the user visual feedback!
            const originalText = this.innerHTML;
            this.innerHTML = `Added! <i class="fa-solid fa-check"></i>`;
            this.classList.replace('btn-dark', 'btn-success');

            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.replace('btn-success', 'btn-dark');
                quantityInput.value = 1; // Reset input back to 1
            }, 900);
        });
    });
}

// ==========================================
// CART PAGE RENDERING & LOGIC
// ==========================================
function renderCartPage() {
    const cartContentDiv = document.getElementById('cart-content');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartTbody = document.querySelector('#cart-content tbody'); // Targets the table body

    // Totals Elements
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const finalTotalEl = document.getElementById('final-total');

    // If these elements don't exist, we aren't on the cart page, so stop here.
    if (!cartContentDiv || !emptyCartMsg) return;

    // 1. Get cart from local storage
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];

    // 2. Handle Empty State
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        cartContentDiv.style.display = 'none';
        return;
    }

    // 3. Show Cart Content
    emptyCartMsg.style.display = 'none';
    cartContentDiv.style.display = 'block';

    // 4. Render Table and Calculate Totals
    if (cartTbody) {
        cartTbody.innerHTML = ''; // Clear any existing static rows
        let subtotal = 0;

        cart.forEach(item => {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">$${item.price.toFixed(2)}</td>
                <td class="text-end fw-bold text-success">$${lineTotal.toFixed(2)}</td>
            `;
            cartTbody.appendChild(tr);
        });

        // Calculate and Display Totals (8.25% Tax)
        const taxRate = 0.0825;
        const tax = subtotal * taxRate;
        const finalTotal = subtotal + tax;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (finalTotalEl) finalTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
    }
}

// ==========================================
// CHECKOUT & MODAL LOGIC
// ==========================================
function setupCheckoutLogic() {
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const submitOrderBtn = document.getElementById('submitOrderBtn');

    // Grab the DOM elements for the modals
    const cancelModalEl = document.getElementById('cancelModal');
    const thankYouModalEl = document.getElementById('thankYouModal');

    // If the modals don't exist, we aren't on the cart page
    if (!cancelModalEl || !thankYouModalEl) return;

    // Initialize Bootstrap modals via Vanilla JS
    const cancelModal = new bootstrap.Modal(cancelModalEl);
    const thankYouModal = new bootstrap.Modal(thankYouModalEl);

    // Cancel Order Confirmation Logic
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function() {
            // Clear cart from local storage
            localStorage.removeItem('myCart');

            // Hide the cancel modal
            cancelModal.hide();

            // Update Thank You message to reflect cancellation
            const thankYouMessage = document.getElementById('thankYouMessage');
            if(thankYouMessage) thankYouMessage.textContent = "Order Cancelled.";

            // Show thank you modal
            thankYouModal.show();
        });
    }

    // Submit Order Logic
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', function() {
            // Clear cart from local storage
            localStorage.removeItem('myCart');

            // Ensure message says thanks for the order
            const thankYouMessage = document.getElementById('thankYouMessage');
            if(thankYouMessage) thankYouMessage.textContent = "Thank you for your order!";

            // Show thank you modal
            thankYouModal.show();
        });
    }

    // Redirect after 3 seconds
    thankYouModalEl.addEventListener('shown.bs.modal', function () {
        setTimeout(function() {
            window.location.href = 'menu.html';
        }, 3000);
    });

    // Redirect when thank you modal is fully hidden/closed by the user
    thankYouModalEl.addEventListener('hidden.bs.modal', function () {
        window.location.href = 'menu.html';
    });
}

// Initializing Page
document.addEventListener("DOMContentLoaded", function() {
    renderCartPage();
    setupCheckoutLogic();
});

// ==========================================
/* Accessibility Updates (received a warning due to pop-up window/fade whenever I select an item. Readers would be unable to view my cancel prompt... */
// ==========================================
const itemDetailsModalElement = document.getElementById('itemDetailsModal');
if (itemDetailsModalElement) {
    itemDetailsModalElement.addEventListener('hide.bs.modal', function () {
        document.activeElement.blur(); // Drops focus before aria-hidden applies
    });
}
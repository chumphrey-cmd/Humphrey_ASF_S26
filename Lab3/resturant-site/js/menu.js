// ==========================================
// Menu Creation
// ==========================================

const MENU_ITEMS = [
    {
        id: 1,
        name: "Berry & Banana French Toast",
        description: "Maple syrup, powdered sugar, and a whole lot of love. Our signature French toast is the perfect way to start your morning. Served with fresh, seasonal berries and perfectly ripe bananas.",
        price: 12.5,
        category: "Breakfast",
        image: "./images/breakfast.jpg"
    },

    {
        id: 2,
        name: "Eggs Benedict",
        description: "Two perfectly poached eggs on a toasted English muffin, layered with thick-cut smoked ham and topped with our house-made hollandaise sauce. Served with a side of roasted breakfast potatoes.",
        price: 16.0,
        category: "Breakfast",
        image: "./images/eggs_benedict.jpg"
    },

    {
        id: 3,
        name: "Breakfast Quiche",
        description: "A buttery, flaky crust enveloping a rich, savory egg custard dotted with gruyère cheese, caramelized onions, and fresh spinach. Baked to a golden perfection.",
        price: 13.0,
        category: "Breakfast",
        image: "./images/breakfast_quiche.jpg"
    },

    {
        id: 4,
        name: "Berry Custard",
        description: "Velvety vanilla bean custard topped with a vibrant compote of seasonal berries and a delicate dusting of powdered sugar. A refreshingly sweet finish to your morning.",
        price: 8.0,
        category: "Breakfast",
        image: "./images/breakfast_berry_custard.jpg"
    },

    {
        id: 5,
        name: "Bacon & Egg Croissant",
        description: "A buttery, flaky croissant baked fresh this morning, stuffed with thick-cut crispy bacon, an over-easy egg, and a slice of sharp cheddar cheese. Comes with a side of mixed fruit.",
        price: 14.5,
        category: "Lunch",
        image: "./images/crossiant_sandwhich.jpg"
    },

    {
        id: 6,
        name: "Steak Tenderloin & Cabbage",
        description: "A perfectly seared, tender cut of steak served alongside char-roasted cabbage. Finished with a light herb butter and a sprinkle of flaky sea salt for a clean, savory bite.",
        price: 24.0,
        category: "Lunch",
        image: "./images/lunch.jpg"
    },

    {
        id: 7,
        name: "Cream Pasta & Broccoli",
        description: "Al dente ribbons of pasta tossed in a luxurious garlic cream sauce, folded together with tender, pan-roasted broccoli florets and finished with shaved Parmesan.",
        price: 18.0,
        category: "Lunch",
        image: "./images/lunch_cream_pasta.jpg"
    },

    {
        id: 8,
        name: "Grilled Salmon with Quinoa",
        description: "A fresh, wild-caught salmon fillet grilled to a tender flake, resting on a bed of fluffy, lemon-herb quinoa and vibrant seasonal greens.",
        price: 22.0,
        category: "Lunch",
        image: "./images/lunch_grilled_salmon_quinoa.jpg"
    },

    {
        id: 9,
        name: "Cold-Brew Iced Coffee",
        description: "Our signature house blend, cold-brewed for 18 hours to ensure a smooth, low-acidity finish. Served over ice with your choice of milk and optional house-made simple syrup.",
        price: 5.0,
        category: "Breakfast",
        image: "./images/iced_coffee.jpg"
    },

    {
        id: 10,
        name: "Iced Matcha",
        description: "Premium ceremonial grade matcha, delicately whisked and poured over ice. Blended with creamy oat milk and lightly sweetened with organic agave.",
        price: 6.0,
        category: "Lunch",
        image: "./images/iced_matcha.jpg"
    }
];

// formatting currency to USD
const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

// ==========================================
// RENDER THE MENU GRID (Cards with Images)
// ==========================================

function renderMenuTable() {
    const menuGrid = document.getElementById("menu-grid");
    if (!menuGrid) return;

    menuGrid.innerHTML = ""; // Clear it once just in case

    // Loop through ALL items
    MENU_ITEMS.forEach(item => {
        const col = document.createElement("div");
        // ADDED: menu-item-col class and data-item-category attribute
        col.className = "col-12 col-md-6 col-lg-4 menu-item-col";
        col.setAttribute('data-item-category', item.category);

        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0" style="background-color: #f8f9fa;">
                <img src="${item.image}" class="card-img-top item-img-trigger" data-id="${item.id}" alt="${item.name}" loading="lazy" decoding="async" style="height: 200px; object-fit: cover; cursor: pointer;">
                
                <div class="card-body d-flex flex-column p-3">
                    <span class="badge bg-secondary align-self-start mb-2">${item.category}</span>
                    <h5 class="card-title fw-bold text-dark mb-3">${item.name}</h5>
                    
                    <div class="mt-auto border-top pt-3 d-flex justify-content-between align-items-center border-secondary-subtle">
                        <span class="fw-bold fs-5 text-success">${moneyFormatter.format(item.price)}</span>
                        
                        <div class="d-flex align-items-center gap-2">
                            <input type="number" id="qty-${item.id}" class="form-control form-control-sm text-center" value="1" min="1" max="5" style="width: 55px;">
                            <button class="btn btn-sm btn-dark add-to-cart-btn" data-id="${item.id}">
                                Add <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        menuGrid.appendChild(col);
    });

    // Attach the click listeners to the images AFTER they are drawn on the screen
    setupModalTriggers();
    setupCartButtons();
}

// ==========================================
// MODAL POP-UP LOGIC
// ==========================================
function setupModalTriggers() {
    // Find every image we just drew that has the 'item-img-trigger' class
    const imageTriggers = document.querySelectorAll('.item-img-trigger');

    imageTriggers.forEach(img => {
        img.addEventListener('click', function() {
            // 1. Find out which item was clicked using the data-id
            const itemId = parseInt(this.getAttribute('data-id'));

            // 2. Search our array for the matching item
            const item = MENU_ITEMS.find(i => i.id === itemId);

            if (item) {
                // 3. Inject the item's data into our empty Master Modal
                document.getElementById('modal-title').textContent = item.name;
                document.getElementById('modal-image').src = item.image;
                document.getElementById('modal-image').alt = item.name;
                document.getElementById('modal-desc').textContent = item.description;
                document.getElementById('modal-price').textContent = moneyFormatter.format(item.price);

                // 4. Tell Bootstrap to pop the modal open!
                const detailsModal = new bootstrap.Modal(document.getElementById('itemDetailsModal'));
                detailsModal.show();
            }
        });
    });
}

// ==========================================
// Side bar filter logic for menu page
// ==========================================
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const clearAllBtn = document.getElementById('clearAllBtn');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const selectedCategory = this.getAttribute('data-category');

            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            this.classList.add('active-filter');

            // THE NEW LOGIC: Just hide/show via CSS!
            const allCards = document.querySelectorAll('.menu-item-col');

            allCards.forEach(card => {
                const cardCategory = card.getAttribute('data-item-category');

                // If "All" is selected OR the category matches, show it. Otherwise, hide it.
                if (selectedCategory === "All" || cardCategory === selectedCategory) {
                    card.style.display = "block"; // Show
                } else {
                    card.style.display = "none";  // Hide
                }
            });
        });
    });

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const allBtn = document.querySelector('[data-category="All"]');
            if (allBtn) allBtn.click();
        });
    }
}

// ==========================================
/* Accessibility Updates (received a warning due to pop-up window/fade whenever I select an item. Readers would be unable to view my menu items... */
// ==========================================
const modalElement = document.getElementById('itemDetailsModal');
if (modalElement) {
    modalElement.addEventListener('hide.bs.modal', function () {
        document.activeElement.blur(); // Drops focus before aria-hidden applies
    });
}

// INITIALIZE PAGE HERE
document.addEventListener("DOMContentLoaded", function() {
    renderMenuTable();
    setupCategoryFilters();
});
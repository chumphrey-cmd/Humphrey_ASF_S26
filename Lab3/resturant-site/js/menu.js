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


// INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", function() {
    renderMenuTable();
    setupCategoryFilters();
});

// // ==========================================
// // Form Validation & Submission
// // ==========================================
//
// const reservationForm = document.getElementById("reservationForm");
// const alertContainer = document.getElementById("alert-container");
//
// // Run only if the reservation form exists on the current page
// if (reservationForm) {
//
//     reservationForm.addEventListener("submit", function(event) {
//
//         // 1. PREVENT DEFAULT SUBMISSION (Stops the page from refreshing)
//         event.preventDefault();
//
//         // 2. CLEAR PREVIOUS ALERTS
//         alertContainer.innerHTML = "";
//
//         let errors = [];
//
//         // 3. GATHER FIELD VALUES
//         const firstName = document.getElementById("firstname").value.trim();
//         const lastName = document.getElementById("lastname").value.trim();
//         const email = document.getElementById("email").value.trim();
//         const phone = document.getElementById("phone").value.trim();
//         const partySize = document.getElementById("party-size").value;
//         const date = document.getElementById("request-date").value;
//         const time = document.getElementById("time").value;
//
//         // For radio buttons, find the one that is currently checked
//         const seatPreference = document.querySelector('input[name="seat-preference"]:checked');
//
//         // Capture the optional fields for validation and data logging
//         const dietaryNotes = document.getElementById("message").value.trim();
//         const newsletterOptIn = document.getElementById("declaration").checked;
//
//         // 4. VALIDATION LOGIC
//         if (firstName === "") {
//             errors.push("Please enter your first name.");
//         } else if (firstName.length > 15) {
//             errors.push("First name cannot exceed 15 characters.");
//         }
//
//         if (lastName.length > 15) {
//             errors.push("Last name cannot exceed 15 characters.");
//         }
//
//         if (email === "" || !email.includes("@")) {
//             errors.push("Please enter a valid email address.");
//         }
//
//         if (phone !== "") {
//             // Regex allows numbers, dashes, parentheses, spaces, and the + sign, between 10 and 15 characters long.
//             const phoneRegex = /^[0-9\-+\s()]{10,15}$/;
//
//             if (!phoneRegex.test(phone)) {
//                 errors.push("Please enter a valid phone number (e.g., 555-123-4567).");
//             }
//         }
//
//         if (partySize === "") {
//             errors.push("Please select your party size.");
//         }
//
//         if (date === "") {
//             errors.push("Please select a reservation date.");
//         }
//
//         if (time === "") {
//             errors.push("Please select a reservation time.");
//         }
//
//         if (!seatPreference) {
//             errors.push("Please select a seating preference (Indoor, Outdoor, or Bar).");
//         }
//
//         // Max length 30 check for dietary notes
//         if (dietaryNotes.length > 30) {
//             errors.push("Dietary notes cannot exceed 30 characters.");
//         }
//
//         // 5. DISPLAY ALERTS
//         if (errors.length > 0) {
//             // Display an error alert for every missing field
//             errors.forEach(function(errorMsg) {
//                 const alertHTML = `
//                     <div class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
//                         <i class="fa-solid fa-circle-exclamation me-2"></i> ${errorMsg}
//                         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//                     </div>
//                 `;
//                 alertContainer.innerHTML += alertHTML;
//             });
//
//             // Smoothly scroll to the top of the form so the user sees the errors
//             alertContainer.scrollIntoView({ behavior: "smooth", block: "start" });
//
//         } else {
//
//             // JavaScript object with all captured values
//             const reservationData = {
//                 firstName: firstName,
//                 lastName: lastName,
//                 email: email,
//                 phone: phone || "none",
//                 partySize: parseInt(partySize),
//                 date: date,
//                 time: time,
//                 seating: seatPreference.value,
//                 dietaryNotes: dietaryNotes || "none",
//                 newsletter: newsletterOptIn
//             };
//
//             // Log information to console log as JSON
//             console.log("--- New Reservation Submitted ---");
//             console.log(reservationData);
//
//             // Kept your custom success message exactly as you wrote it!
//             const successHTML = `
//                 <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
//                     <i class="fa-solid fa-circle-check me-2"></i>
//
//                     <strong>Reservation Recieved!</strong>
//
//                     Thank you, ${firstName}.
//
//                     Your reservation for a party of <strong>${partySize}</strong> on <strong>${date}</strong> and has been confirmed.
//
//                      Details are being sent to <strong>${email}</strong>.
//
//                     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//                 </div>
//             `;
//             alertContainer.innerHTML = successHTML;
//
//             // Wipe the form inputs clean for the next submission
//             reservationForm.reset();
//
//             // Scroll to the success message
//             alertContainer.scrollIntoView({ behavior: "smooth", block: "center" });
//         }
//
//         // Clear alerts when the Reset button is clicked
//         reservationForm.addEventListener("reset", function() {
//             alertContainer.innerHTML = "";
//         });
//     });
// }

// // ==========================================
// // Shopping cart using localStorage
// // ==========================================
// function setupCartButtons() {
//     const cartButtons = document.querySelectorAll('.add-to-cart-btn');
//
//     cartButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // 1. Get the item ID and the Quantity the user selected
//             const itemId = parseInt(this.getAttribute('data-id'));
//             const quantityInput = document.getElementById(`qty-${itemId}`);
//             const quantity = parseInt(quantityInput.value);
//
//             // 2. Validate quantity (Rubric requires 1-5)
//             if (quantity < 1 || quantity > 5) {
//                 alert("Please select a quantity between 1 and 5.");
//                 return;
//             }
//
//             // 3. Find the full item details from our MENU_ITEMS array
//             const selectedItem = MENU_ITEMS.find(item => item.id === itemId);
//
//             // 4. Get the current cart from localStorage (or start an empty one)
//             let cart = JSON.parse(localStorage.getItem('myCart')) || [];
//
//             // 5. Check if this item is ALREADY in the cart
//             const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
//
//             if (existingItemIndex > -1) {
//                 // If it is, just update the quantity
//                 cart[existingItemIndex].quantity += quantity;
//                 // Optional: Cap it at 5 max to follow rubric constraints tightly
//                 if (cart[existingItemIndex].quantity > 5) cart[existingItemIndex].quantity = 5;
//             } else {
//                 // If it's new, add it to the cart array
//                 cart.push({
//                     id: selectedItem.id,
//                     name: selectedItem.name,
//                     price: selectedItem.price,
//                     quantity: quantity
//                 });
//             }
//
//             // 6. Save the updated cart back to localStorage
//             localStorage.setItem('myCart', JSON.stringify(cart));
//
//             // 7. Give the user visual feedback!
//             const originalText = this.innerHTML;
//             this.innerHTML = `Added! <i class="fa-solid fa-check"></i>`;
//             this.classList.replace('btn-dark', 'btn-success');
//
//             setTimeout(() => {
//                 this.innerHTML = originalText;
//                 this.classList.replace('btn-success', 'btn-dark');
//                 quantityInput.value = 1; // Reset input back to 1
//             }, 900);
//         });
//     });
// }

// ==========================================
/* Accessibility Updates (received a warning due to pop-up window/fade whenever I select an item. Readers would be unable to view my menu items... */
// ==========================================
const modalElement = document.getElementById('itemDetailsModal');
if (modalElement) {
    modalElement.addEventListener('hide.bs.modal', function () {
        document.activeElement.blur(); // Drops focus before aria-hidden applies
    });
}
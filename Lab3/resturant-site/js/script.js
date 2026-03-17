// ==========================================
// Menu Creation
// ==========================================

// array for 10 menu item objects.

const MENU_ITEMS = [
    { id: 1, name: "Berry & Banana French Toast", description: "Thick-cut brioche, fresh berries, bananas, maple syrup", price: 12.5, category: "Breakfast" },
    { id: 2, name: "Eggs Benedict", description: "Poached eggs, smoked ham, hollandaise, English muffin", price: 16.0, category: "Breakfast" },
    { id: 3, name: "Breakfast Quiche", description: "Gruyère, caramelized onions, spinach, egg", price: 13.0, category: "Breakfast" },
    { id: 4, name: "Berry Custard", description: "Vanilla bean custard, seasonal mixed berries", price: 8.0, category: "Breakfast" },
    { id: 5, name: "Bacon & Egg Croissant", description: "Flaky croissant, crispy bacon, over-easy egg, cheddar", price: 14.5, category: "Lunch" },
    { id: 6, name: "Steak Tenderloin & Cabbage", description: "Seared tenderloin, roasted cabbage, herb butter", price: 24.0, category: "Lunch" },
    { id: 7, name: "Cream Pasta & Broccoli", description: "Garlic cream sauce, parmesan, roasted broccoli", price: 18.0, category: "Lunch" },
    { id: 8, name: "Grilled Salmon with Quinoa", description: "Wild-caught salmon, lemon-herb quinoa", price: 22.0, category: "Lunch" },
    { id: 9, name: "Cold-Brew Iced Coffee", description: "18-hour cold brew, choice of milk, ice", price: 5.0, category: "Breakfast" },
    { id: 10, name: "Iced Matcha", description: "Ceremonial grade matcha, oat milk, agave, ice", price: 6.0, category: "Lunch" }
];

// formatting currency to USD
const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

// rendering the actual menu table
function renderMenuTable() {
    // Find the <tbody> element in the HTML
    const tableBody = document.getElementById("menu-table-body");

    // only run this code if we are actually on the menu page
    if (!tableBody) return;

    // clearing any existing content just in case
    tableBody.innerHTML = "";

    // Loop through every item in our array
    MENU_ITEMS.forEach(function(item) {

        // Create a new table row
        const row = document.createElement("tr");

        // place the HTML into the row
        row.innerHTML = `
            <td class="fw-bold">${item.name}</td>
            <td class="text-muted">${item.description}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td class="fw-bold text-success">${moneyFormatter.format(item.price)}</td>
        `;

        // Attach the finished row to the table body
        tableBody.appendChild(row);
    });
}

// run the function as soon as the webpage loads
document.addEventListener("DOMContentLoaded", renderMenuTable);

// ==========================================
// Form Validation & Submission
// ==========================================

const reservationForm = document.getElementById("reservationForm");
const alertContainer = document.getElementById("alert-container");

// Run only if the reservation form exists on the current page
if (reservationForm) {

    reservationForm.addEventListener("submit", function(event) {

        // 1. PREVENT DEFAULT SUBMISSION (Stops the page from refreshing)
        event.preventDefault();

        // 2. CLEAR PREVIOUS ALERTS
        alertContainer.innerHTML = "";

        let errors = [];

        // 3. GATHER FIELD VALUES
        const firstName = document.getElementById("firstname").value.trim();
        const lastName = document.getElementById("lastname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const partySize = document.getElementById("party-size").value;
        const date = document.getElementById("request-date").value;
        const time = document.getElementById("time").value;

        // For radio buttons, find the one that is currently checked
        const seatPreference = document.querySelector('input[name="seat-preference"]:checked');

        // Capture the optional fields for validation and data logging
        const dietaryNotes = document.getElementById("message").value.trim();
        const newsletterOptIn = document.getElementById("declaration").checked;

        // 4. VALIDATION LOGIC
        if (firstName === "") {
            errors.push("Please enter your first name.");
        } else if (firstName.length > 15) {
            errors.push("First name cannot exceed 15 characters.");
        }

        if (lastName.length > 15) {
            errors.push("Last name cannot exceed 15 characters.");
        }

        if (email === "" || !email.includes("@")) {
            errors.push("Please enter a valid email address.");
        }

        if (phone !== "") {
            // Regex allows numbers, dashes, parentheses, spaces, and the + sign, between 10 to 15 characters long.
            const phoneRegex = /^[0-9\-+\s()]{10,15}$/;

            if (!phoneRegex.test(phone)) {
                errors.push("Please enter a valid phone number (e.g., 555-123-4567).");
            }
        }

        if (partySize === "") {
            errors.push("Please select your party size.");
        }

        if (date === "") {
            errors.push("Please select a reservation date.");
        }

        if (time === "") {
            errors.push("Please select a reservation time.");
        }

        if (!seatPreference) {
            errors.push("Please select a seating preference (Indoor, Outdoor, or Bar).");
        }

        // Max length 30 check for dietary notes
        if (dietaryNotes.length > 30) {
            errors.push("Dietary notes cannot exceed 30 characters.");
        }

        // 5. DISPLAY ALERTS
        if (errors.length > 0) {
            // Display an error alert for every missing field
            errors.forEach(function(errorMsg) {
                const alertHTML = `
                    <div class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                        <i class="fa-solid fa-circle-exclamation me-2"></i> ${errorMsg}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.innerHTML += alertHTML;
            });

            // Smoothly scroll to the top of the form so the user sees the errors
            alertContainer.scrollIntoView({ behavior: "smooth", block: "start" });

        } else {

            // JavaScript object with all captured values
            const reservationData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone || "none",
                partySize: parseInt(partySize),
                date: date,
                time: time,
                seating: seatPreference.value,
                dietaryNotes: dietaryNotes || "none",
                newsletter: newsletterOptIn
            };

            // Log information to console log as JSON
            console.log("--- New Reservation Submitted ---");
            console.log(reservationData);

            // Kept your custom success message exactly as you wrote it!
            const successHTML = `
                <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-check me-2"></i> 
                    
                    <strong>Reservation Recieved!</strong> 
                    
                    Thank you, ${firstName}. 
                    
                    Your reservation for a party of <strong>${partySize}</strong> on <strong>${date}</strong> and has been confirmed.
                     
                     Details are being sent to <strong>${email}</strong>.
                    
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            alertContainer.innerHTML = successHTML;

            // Wipe the form inputs clean for the next submission
            reservationForm.reset();

            // Scroll to the success message
            alertContainer.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Clear alerts when the Reset button is clicked
        reservationForm.addEventListener("reset", function() {
            alertContainer.innerHTML = "";
        });
    });
}
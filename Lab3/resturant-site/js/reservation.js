// ==========================================
// Reservation Form Validation & Submission
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
            // Regex allows numbers, dashes, parentheses, spaces, and the + sign, between 10 and 15 characters long.
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

            // Custom success message!
            alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-check me-2"></i> 
                    
                    <strong>Reservation Recieved!</strong> 
                    
                    Thank you, ${firstName}. 
                    
                    Your reservation for a party of <strong>${partySize}</strong> on <strong>${date}</strong> and has been confirmed.
                     
                     Details are being sent to <strong>${email}</strong>.
                    
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

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
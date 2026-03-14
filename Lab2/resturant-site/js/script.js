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
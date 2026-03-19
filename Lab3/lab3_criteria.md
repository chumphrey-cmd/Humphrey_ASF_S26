### Part 1: Menu Page Updates (`menu.html` & `menu.js`)

* [X] **Add a Category Filter:** Add a dropdown menu to `menu.html` with the options: "All", "Breakfast", "Lunch", and "Dinner".
* [X] **Dynamic Filtering:** Write JavaScript to automatically hide/show menu items based on the selected category in the dropdown.

### Part 2: Add to Cart Functionality (`menu.html` & `menu.js`)

* [X] **Quantity Selector:** Add an input/dropdown to *every* menu item allowing the user to select a quantity (minimum range: 1–5).
* [X] **Add to Cart Button:** Add a button to *every* menu item to trigger the cart logic.
* [X] **Cart Logic:** Write JavaScript so that clicking "Add to Cart" captures the item's data and quantity, and saves it (likely using `localStorage`) so the next page can read it.

### Part 3: The Cart Page (`cart.html` & `menu.js`)

* [X] **New File Creation:** Create `cart.html` and include your standard Bootstrap navbar and custom CSS.
* [X] **Empty State:** If the cart has no items, display the message: *"Your cart is empty."*
* [X] **Cart Display:** Use JavaScript to dynamically generate a list/table of all current items in the cart, including their quantities.
* [X] **Dynamic Math:** Calculate and display the **Line Total** (Price × Quantity), **Subtotal**, **Tax** (fixed rate, e.g., 8%), and **Final Total**.
* [X] **No CRUD:** Do not worry about adding "Edit" or "Remove" buttons for individual items in the cart.

### Part 4: Checkout Buttons & Modals (`cart.html` & `menu.js`)

* [X] **Checkout UI:** Add "Cancel Order" and "Submit Order" buttons to the bottom of the cart page.
* [X] **Cancel Order Logic:**
* [X] Clicking it triggers a Bootstrap Modal asking: *"Are you sure you want to cancel your order?"*
* [X] If they don't confirm: Close the modal.
* [X] If they confirm: Clear the cart data, show a "Thank you" confirmation modal, and redirect back to `menu.html` when closed.


* [x] **Submit Order Logic:**
* [X] Clicking it triggers a Bootstrap "Thank You" modal.
* [X] Clear the cart data.
* [X] Redirect back to `menu.html` when the modal is closed.



### Technical Constraints

* [X] Use Bootstrap for all layout and modals.
* [X] Use **Vanilla JavaScript only** (No React, jQuery, etc.).
* [X] No inline JavaScript (e.g., no `onclick="..."` in your HTML).
* [X] Ensure there are zero console errors when testing.
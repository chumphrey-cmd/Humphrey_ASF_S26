### Part 1: Menu Page Updates (`menu.html` & `script.js`)

* [ ] **Add a Category Filter:** Add a dropdown menu to `menu.html` with the options: "All", "Breakfast", "Lunch", and "Dinner".
* [ ] **Dynamic Filtering:** Write JavaScript to automatically hide/show menu items based on the selected category in the dropdown.

### Part 2: Add to Cart Functionality (`menu.html` & `script.js`)

* [ ] **Quantity Selector:** Add an input/dropdown to *every* menu item allowing the user to select a quantity (minimum range: 1–5).
* [ ] **Add to Cart Button:** Add a button to *every* menu item to trigger the cart logic.
* [ ] **Cart Logic:** Write JavaScript so that clicking "Add to Cart" captures the item's data and quantity, and saves it (likely using `localStorage`) so the next page can read it.

### Part 3: The Cart Page (`cart.html` & `script.js`)

* [ ] **New File Creation:** Create `cart.html` and include your standard Bootstrap navbar and custom CSS.
* [ ] **Empty State:** If the cart has no items, display the message: *"Your cart is empty."*
* [ ] **Cart Display:** Use JavaScript to dynamically generate a list/table of all current items in the cart, including their quantities.
* [ ] **Dynamic Math:** Calculate and display the **Line Total** (Price × Quantity), **Subtotal**, **Tax** (fixed rate, e.g., 8%), and **Final Total**.
* [ ] **No CRUD:** Do not worry about adding "Edit" or "Remove" buttons for individual items in the cart.

### Part 4: Checkout Buttons & Modals (`cart.html` & `script.js`)

* [ ] **Checkout UI:** Add "Cancel Order" and "Submit Order" buttons to the bottom of the cart page.
* [ ] **Cancel Order Logic:**
* [ ] Clicking it triggers a Bootstrap Modal asking: *"Are you sure you want to cancel your order?"*
* [ ] If they don't confirm: Close the modal.
* [ ] If they confirm: Clear the cart data, show a "Thank you" confirmation modal, and redirect back to `menu.html` when closed.


* [ ] **Submit Order Logic:**
* [ ] Clicking it triggers a Bootstrap "Thank You" modal.
* [ ] Clear the cart data.
* [ ] Redirect back to `menu.html` when the modal is closed.



### Technical Constraints

* [ ] Use Bootstrap for all layout and modals.
* [ ] Use **Vanilla JavaScript only** (No React, jQuery, etc.).
* [ ] No inline JavaScript (e.g., no `onclick="..."` in your HTML).
* [ ] Ensure there are zero console errors when testing.
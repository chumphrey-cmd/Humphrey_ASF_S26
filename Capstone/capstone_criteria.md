### Phase 1: Tech Stack & Architecture Setup
**Core Technologies:** React, React Router, Reactstrap, React Hook Form, Yup.
**State Management:** Top-level state in `App.jsx` passed down via props (as per your current studies).
**Quality Rules:** No console errors, no inline `<script>` tags, clear accessibility (labels, button text), and consistent Reactstrap UI styling.

**Folder Structure Goal:**
```text
src/
├── components/
│   ├── SiteNavbar.jsx     (Reactstrap navbar, used everywhere)
│   ├── MenuFilter.jsx     (Category dropdown)
│   ├── MenuItemCard.jsx   (Single item display with quantity + Add button)
│   ├── CartSummary.jsx    (Totals section)
│   └── ConfirmModal.jsx   (Reactstrap modal for Submit/Cancel flows)
├── pages/
│   ├── HomePage.jsx       (Maps to /)
│   ├── MenuPage.jsx       (Maps to /menu)
│   ├── ReservationsPage.jsx (Maps to /reservations)
│   └── CartPage.jsx       (Maps to /cart)
├── data/
│   └── menuData.js        (Contains id, name, category, price, description)
├── App.jsx                (Holds Router and Cart State)
└── main.jsx
```

### Phase 2: Routing & Layout
* **Navigation:** Implement `React Router` in `App.jsx` to map out the four main pages (`/`, `/menu`, `/reservations`, `/cart`).
* **Page Reloads:** Ensure links use React Router (no full page reloads).
* **Global UI:** Add the `SiteNavbar` to run consistently across all routes.

### Phase 3: The Menu & Data
* **Mock Data:** Create `menuData.js` to store all menu items instead of hardcoding HTML.
* **Menu Page Layout:** * Implement `MenuFilter` to sort items by: All, Breakfast, Lunch, Dinner.
    * Map through the data to render `MenuItemCard` components.
* **Item Interactions:** Each card needs a quantity selector (min 1, max 5) and an "Add to Cart" button.

### Phase 4: Cart State & Page Logic
* **Cart State:** Track an array of objects (id, name, price, quantity) in `App.jsx`.
* **Adding Items:** If an item is added that already exists in the cart, update the quantity (cap at 5).
* **Cart Page:**
    * Show "Your cart is empty" if there are no items.
    * Display line totals, subtotal, fixed tax (8% or 8.25%), and final total using React state math.
* **Modals (ConfirmModal):**
    * *Cancel Flow:* Ask "Are you sure?" -> Clear cart -> Show Thank You -> Redirect to `/menu`.
    * *Submit Flow:* Show Thank You -> Clear cart -> Redirect to `/menu`.

### Phase 5: Reservations Form
* **Form Setup:** Use `React Hook Form` combined with `Yup` for schema validation. Inline errors only (no browser default popups).
* **Validation Rules:**
    * *Name:* Required, max 20 chars.
    * *Email:* Required, valid email format.
    * *Party Size:* Required, 1-8.
    * *Date & Time:* Required.
    * *Seating:* Required radio group (3+ options).
    * *Dietary:* Optional, max 30 chars.
    * *Newsletter:* Optional checkbox.
* **Submission:** On success, confirm the reservation and clear the form.


### Phase 6: JSON.stringify
* compress form input via JSON stringify to simulate sending the data over to the DB

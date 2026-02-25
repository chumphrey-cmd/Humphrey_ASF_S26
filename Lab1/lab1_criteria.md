### General Rules & Constraints

* [ ] Use **HTML and CSS only**.
* [ ] Do **not** use Bootstrap or JavaScript.
* [ ] Use an **external stylesheet only** (named `styles.css`).
* [ ] Do **not** use `<br>` tags (use CSS margins/padding for spacing).
* [ ] Keep layout, brand, and theme consistent across all pages.

---

### Folder & File Structure

* [ ] Create a main folder named `restaurant-site`.
* [ ] Create `index.html` (Home Page).
* [ ] Create `menu.html` (Menu Page).
* [ ] Create `reservations.html` (Reservations Page).
* [ ] Create `styles.css`.
* [ ] Create an `images` folder containing:
* [ ] 1 Logo image (`logo.png`).
* [ ] 3 Content images (`img1.jpg`, `img2.jpg`, `img3.jpg`).



---

### Global Elements (All Pages)

* [ ] Include a Navbar with links to Home, Menu, and Reservations.
* [ ] Ensure the logo image is present (usually in the header/navbar).

---

### 1. Home Page (`index.html`)

* [ ] Create a Hero section containing:
* [ ] An `<h1>` tag with the restaurant name.
* [ ] A short tagline.
* [ ] One content image (Image #1) with `alt` text.



---

### 2. Menu Page (`menu.html`)

* [ ] Include an intro paragraph describing the menu style.
* [ ] Include one content image (Image #3) near the menu section.
* [ ] Create one HTML table containing:
* [ ] `<caption>`
* [ ] `<thead>` and `<tbody>`
* [ ] At least 6 rows of menu items.
* [ ] *Suggestion:* Columns for Combo, Includes, Price, and Notes (e.g., "Spicy").



---

### 3. Reservations Page (`reservations.html`)

* [ ] Include a short paragraph explaining reservations are "request only".
* [ ] Create a form with basic HTML validation:
* [ ] **Name:** Text input (Required, maximum 20 characters).
* [ ] **Email:** Email input (Required).
* [ ] **Party size:** `<select>` dropdown (Values from 1 to 8).
* [ ] **Date:** Date input (Required).
* [ ] **Time:** Time input (Required).
* [ ] **Seating preference:** Radio buttons (At least 3 options, e.g., Indoor, Outdoor, Bar).
* [ ] **Dietary notes:** `<textarea>` (Optional, maximum 30 characters).
* [ ] **Newsletter opt-in:** Checkbox (Optional).


* [ ] Group the radio buttons using a `<fieldset>` with a clear `<legend>`.
* [ ] Associate **every** input with a `<label>` element.
* [ ] Include a **Submit** button and a **Reset** button.

---

### Image Placement Check

* [ ] Logo used.
* [ ] Content Image #1 used on Home Page.
* [ ] Content Image #3 used on Menu Page.
* [ ] Content Image #2 used somewhere on the site (Home, Menu, or Reservations).

---

### CSS Requirements (`styles.css`)

* [ ] Add a comment at the top explaining your color theme choices.
* [ ] Import and use a **Google Font** for the restaurant name.
* [ ] Style the Navbar (horizontal layout and a hover state).
* [ ] Create a reusable `.card` class (background, padding, border; shadow is optional).
* [ ] Style all images so they do not overflow their containers (e.g., `max-width: 100%;`).
* [ ] Style the table (add borders, zebra striping, and style the caption).
* [ ] Style the form (align labels, add spacing, and ensure consistent input widths).
* [ ] Include **Font Awesome** icons somewhere on the site.
* [ ] Add a comment in the CSS file stating exactly where Font Awesome is being used.

---
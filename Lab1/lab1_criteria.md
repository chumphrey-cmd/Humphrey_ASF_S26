### General Rules & Constraints

* [X] Use **HTML and CSS only**.
* [X] Do **not** use Bootstrap or JavaScript.
* [X] Use an **external stylesheet only** (named `styles.css`).
* [X] Do **not** use `<br>` tags (use CSS margins/padding for spacing).
* [X] Keep layout, brand, and theme consistent across all pages.

---

### Folder & File Structure

* [X] Create a main folder named `restaurant-site`.
* [X] Create `index.html` (Home Page).
* [X] Create `menu.html` (Menu Page).
* [X] Create `reservations.html` (Reservations Page).
* [X] Create `styles.css`.
* [X] Create an `images` folder containing:
* [X] 1 Logo image (`logo.png`).
* [X] 3 Content images (`img1.jpg`, `img2.jpg`, `img3.jpg`).



---

### Global Elements (All Pages)

* [X] Include a Navbar with links to Home, Menu, and Reservations.
* [X] Ensure the logo image is present (usually in the header/navbar).

---

### 1. Home Page (`index.html`)

* [X] Create a Hero section containing:
* [X] An `<h1>` tag with the restaurant name.
* [X] A short tagline.
* [X] One content image (Image #1) with `alt` text.

---

### 2. Menu Page (`menu.html`)

* [X] Include an intro paragraph describing the menu style.
* [X] Include one content image (Image #3) near the menu section.
* [X] Create one HTML table containing:
* [X] `<caption>`
* [X] `<thead>` and `<tbody>`
* [X] At least 6 rows of menu items.
* [X] *Suggestion:* Columns for Combo, Includes, Price, and Notes (e.g., "Spicy").



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

* [X] Logo used.
* [X] Content Image #1 used on Home Page.
* [X] Content Image #3 used on Menu Page.
* [X] Content Image #2 used somewhere on the site (Home, Menu, or Reservations).

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
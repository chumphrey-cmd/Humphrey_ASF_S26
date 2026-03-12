## 0. To-do From Previous Lab

* [ ] Update background color to something more obvious that fits the theme (maybe texturize the webpage like parchment paper.)
* [ ] Select a higher resolution atmosphere.jpg image, the current image is too grainy!

## 1. File Structure & Assets

* [ ] Ensure all 3 main HTML files exist: `index.html`, `menu.html`, `reservations.html`.
* [ ] Ensure `styles.css` exists for custom theme styling.
* [ ] Create a new `script.js` file for all JavaScript logic.
* [ ] Ensure the `images/` folder contains:
* [ ] `logo.png` (Used in the navbar).
* [ ] At least 3 content images used across the site.



## 2. Global Rules (Apply to ALL pages)

* [ ] Include the **Bootstrap CDN** links (CSS and JS) in the `<head>`/`<body>` of all HTML files.
* [ ] Link `styles.css` on all pages (load it *after* Bootstrap so your custom styles win).
* [ ] Link `script.js` on all pages (usually at the bottom of the `<body>`).
* [ ] **No frameworks or jQuery allowed** (Vanilla JavaScript and DOM manipulation only).
* [ ] **No inline JavaScript** (e.g., no `onclick="..."` in the HTML).
* [ ] **No `<br>` tags** used for spacing (use CSS/Bootstrap margins/padding instead).
* [ ] Use semantic HTML and properly linked `<label>` tags for all form inputs.

## 3. Part A: Bootstrap Structure Upgrade

* [ ] **A1. Bootstrap Navbar (All Pages)**
* [ ] Replace the current CSS navbar with a Bootstrap Navbar component.
* [ ] Include the Brand area featuring `logo.png` + the Restaurant Name.
* [ ] Include navigation links: Home, Menu, Reservations.
* [ ] Ensure the navbar collapses into a "hamburger" menu on mobile/small screens.


* [ ] **A2. Responsive Layout (All Pages)**
* [ ] Wrap main page content in Bootstrap grid containers (`.container`, `.row`, `.col-`).
* [ ] Ensure the layout adapts cleanly across desktop, tablet, and mobile devices.



## 4. Part B: Menu Page (`menu.html` & `script.js`)

* [ ] **B1. Menu Data Structure**
* [ ] Create an array named `MENU_ITEMS` in `script.js`.
* [ ] Include **10 or more** menu item objects in the array.
* [ ] Ensure each object has the exact following properties: `id` (number), `name` (string), `description` (string), `price` (number), and `category` (must be exactly "Breakfast", "Lunch", or "Dinner").


* [ ] **B2. DOM Rendering**
* [ ] Remove the hard-coded HTML menu items/table from `menu.html`.
* [ ] Write a JavaScript function to loop through `MENU_ITEMS` and inject them into the DOM.
* [ ] Render the items using either a **Bootstrap Table** or **Bootstrap Cards**.


* [ ] **B3. Price Formatting**
* [ ] Format all prices using JavaScript's `Intl.NumberFormat()`.
* [ ] Ensure no hard-coded currency symbols (like `$`) exist in the raw HTML or data array.



## 5. Part C: Reservations Page (`reservations.html` & `script.js`)

* [ ] **C1. Form Structure**
* [ ] Full Name (max 20 characters).
* [ ] Email Address.
* [ ] Party Size (Select dropdown, options 1–8).
* [ ] Date of Reservation.
* [ ] Time of Reservation.
* [ ] Seating Preference (Radio buttons inside a `<fieldset>` with a `<legend>`).
* [ ] Dietary Notes (Textarea, optional, max 30 characters).
* [ ] Newsletter Opt-in (Checkbox, optional).
* [ ] Submit button & Reset button.


* [ ] **C2. JavaScript-Only Validation**
* [ ] **CRITICAL:** Remove all HTML validation attributes from the form (delete `required`, `min`, `maxlength`, `pattern`, etc.).
* [ ] Add an event listener in `script.js` for the form's `submit` event.
* [ ] Use `event.preventDefault()` to stop the page from reloading.
* [ ] Write JS logic to check if required fields are filled and rules (like max characters) are followed.


* [ ] **C3. Error & Success Display (DOM)**
* [ ] Create an empty `<div>` in the HTML to hold alert messages.
* [ ] If validation **fails**: Use JS to inject a Bootstrap `.alert.alert-danger` detailing the errors.
* [ ] If validation **passes**: Use JS to inject a Bootstrap `.alert.alert-success` confirming the reservation.
* [ ] Ensure the alert text is generated via JavaScript DOM manipulation, not hard-coded in HTML.


* [ ] **C4. Successful Submit Data Handling**
* [ ] On a successful validation pass, capture all form input values.
* [ ] Build a single JavaScript object containing these values (e.g., `name`, `email`, `partySize`, `date`, `time`, `seating`, `dietaryNotes`, `newsletter`).
* [ ] `console.log()` the final object.
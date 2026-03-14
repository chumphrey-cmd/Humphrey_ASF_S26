## 0. To-do From Previous Lab

* [X] Update background color to something more obvious that fits the theme (maybe texturize the webpage like parchment paper.)
* [X] Select a higher resolution atmosphere.jpg image, the current image is too grainy!

## 1. File Structure & Assets

* [X] Ensure all 3 main HTML files exist: `index.html`, `menu.html`, `reservations.html`.
* [X] Ensure `styles.css` exists for custom theme styling.
* [X] Create a new `script.js` file for all JavaScript logic.
* [X] Ensure the `images/` folder contains:
* [X] `logo.png` (Used in the navbar).
* [X] At least 3 content images used across the site.



## 2. Global Rules (Apply to ALL pages)

* [X] Include the **Bootstrap CDN** links (CSS and JS) in the `<head>`/`<body>` of all HTML files.
* [X] Link `styles.css` on all pages (load it *after* Bootstrap so your custom styles win).
* [X] Link `script.js` on all pages (usually at the bottom of the `<body>`).
* [X] **No frameworks or jQuery allowed** (Vanilla JavaScript and DOM manipulation only).
* [X] **No inline JavaScript** (e.g., no `onclick="..."` in the HTML).
* [X] **No `<br>` tags** used for spacing (use CSS/Bootstrap margins/padding instead).
* [X] Use semantic HTML and properly linked `<label>` tags for all form inputs.

## 3. Part A: Bootstrap Structure Upgrade

* [X] **A1. Bootstrap Navbar (All Pages)**
* [X] Replace the current CSS navbar with a Bootstrap Navbar component.
* [X] Include the Brand area featuring `logo.png` + the Restaurant Name.
* [X] Include navigation links: Home, Menu, Reservations.
* [X] Ensure the navbar collapses into a "hamburger" menu on mobile/small screens.


* [X] **A2. Responsive Layout (All Pages)**
* [X] Wrap main page content in Bootstrap grid containers (`.container`, `.row`, `.col-`).
* [X] Ensure the layout adapts cleanly across desktop, tablet, and mobile devices.



## 4. Part B: Menu Page (`menu.html` & `script.js`)

* [X] **B1. Menu Data Structure**
* [X] Create an array named `MENU_ITEMS` in `script.js`.
* [X] Include **10 or more** menu item objects in the array.
* [X] Ensure each object has the exact following properties: `id` (number), `name` (string), `description` (string), `price` (number), and `category` (must be exactly "Breakfast", "Lunch", or "Dinner").


* [X] **B2. DOM Rendering**
* [X] Remove the hard-coded HTML menu items/table from `menu.html`.
* [X] Write a JavaScript function to loop through `MENU_ITEMS` and inject them into the DOM.
* [X] Render the items using either a **Bootstrap Table** or **Bootstrap Cards**.


* [X] **B3. Price Formatting**
* [X] Format all prices using JavaScript's `Intl.NumberFormat()`.
* [X] Ensure no hard-coded currency symbols (like `$`) exist in the raw HTML or data array.



## 5. Part C: Reservations Page (`reservations.html` & `script.js`)

* [X] **C1. Form Structure**
* [X] Full Name (max 20 characters).
* [X] Email Address.
* [X] Party Size (Select dropdown, options 1–8).
* [X] Date of Reservation.
* [X] Time of Reservation.
* [X] Seating Preference (Radio buttons inside a `<fieldset>` with a `<legend>`).
* [X] Dietary Notes (Textarea, optional, max 30 characters).
* [X] Newsletter Opt-in (Checkbox, optional).
* [X] Submit button & Reset button.


* [X] **C2. JavaScript-Only Validation**
* [X] **CRITICAL:** Remove all HTML validation attributes from the form (delete `required`, `min`, `maxlength`, `pattern`, etc.).
* [X] Add an event listener in `script.js` for the form's `submit` event.
* [X] Use `event.preventDefault()` to stop the page from reloading.
* [X] Write JS logic to check if required fields are filled and rules (like max characters) are followed.


* [X] **C3. Error & Success Display (DOM)**
* [X] Create an empty `<div>` in the HTML to hold alert messages.
* [X] If validation **fails**: Use JS to inject a Bootstrap `.alert.alert-danger` detailing the errors.
* [X] If validation **passes**: Use JS to inject a Bootstrap `.alert.alert-success` confirming the reservation.
* [X] Ensure the alert text is generated via JavaScript DOM manipulation, not hard-coded in HTML.


* [X] **C4. Successful Submit Data Handling**
* [X] On a successful validation pass, capture all form input values.
* [X] Build a single JavaScript object containing these values (e.g., `name`, `email`, `partySize`, `date`, `time`, `seating`, `dietaryNotes`, `newsletter`).
* [X] `console.log()` the final object.
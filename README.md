# Project-milestone-1
# Bmyptla – Project Milestone

Live site: https://avicioso-create.github.io/Project-milestone-1/

Bmyptla is a fitness website for my strength training business in Los Angeles.
It has three pages: **Home**, **About**, and **Workout**.

## Visual Design – Gestalt Principles

- **Proximity:** I used proximity to group each card's title, photo, and description close
  together, so users know they belong to the same trainer or workout. Before, the cards used
  `justify-content: space-between`, which left a big empty gap between the name and the photo.
  I also grouped Phone, Email, and Creator together in the Contact Us section.
- **Similarity:** I used similarity to make all trainer and workout cards look the same
  (same dark background, red top border, and uppercase Oswald title), so users understand they
  are the same type of content. All main actions ("Browse Workouts," "Book a Free Assessment,"
  and "Send Message") use the same red `.btn` style, so users know they are clickable. Every
  section heading has the same red bar on the left.
- **Common Region:** I used common region by putting each section (Exercise with Intention,
  Meet Our Team, Contact Us) inside its own rounded panel, and each person or workout inside
  its own card.
- **Figure/Ground:** I changed the footer from `position: fixed` to a normal footer, so it no
  longer covers the page content. Now the main content is clearly in front.

## Color Palette

The same colors are used on every page. They are saved as CSS variables in `style.css`:

| Variable          | Hex       | Use                                   |
|-------------------|-----------|---------------------------------------|
| `--primary-bg`    | `#121824` | Page background and cards             |
| `--surface-bg`    | `#1e2640` | Header, sections, and footer          |
| `--accent`        | `#e8222e` | Buttons, borders, links (matches the logo) |
| `--accent-hover`  | `#ff4d57` | Hover and keyboard focus              |
| `--text-main`     | `#f4f5f7` | Headings and labels                   |
| `--text-muted`    | `#9ba4b4` | Body text                             |
| `--error`         | `#ff6b6b` | Form error messages                   |
| `--success`       | `#4ade80` | Form success message                  |

I changed my accent color from orange to red so it matches my logo. I also made the Contact Us
section the same on every page (same heading and same order).

## Accessible Contact Form

I added a contact form to the About page (`about.html#contact-form`). The "Book a Free
Assessment" buttons on the Home and Workout pages link to it.

- Every input has a `<label>` connected with `for` and `id`.
- I used `<fieldset>` and `<legend>` to group "Your Information" and the "What is your main
  goal?" radio buttons.
- Required fields use `required` and `aria-required="true"`.
- **Error states:** when a field is empty or wrong, it gets `aria-invalid="true"`, a red border,
  and an error message with a ⚠ icon, so the error is not shown only by color. Each message is
  connected to its input with `aria-describedby`.
- An error summary at the top uses `role="alert"`, so screen readers announce it. It has links
  to each field with a problem, and the keyboard focus moves to the first error.
- All links, buttons, and inputs have a visible focus outline for keyboard users.

## Files

- `index.html` – Home page
- `about.html` – About page with team and contact form
- `workout.html` – Workout page
- `style.css` – Shared styles and color palette
- `script.js` – Form validation and accessible error messages

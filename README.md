# ZONGO Connect — Jobs, Services, Property

This is a GitHub Pages + Firebase starter for the ZONGO-style local marketplace you described.

## Included
- Home page styled around the supplied ZONGO screenshots: promo banner, navigation/search, horizontal promotional rails and section-by-section listing rails.
- Jobs, Services and For Sale category pages.
- Main category + subcategory system.
- 36 Nigerian state pages.
- State pages show separate Jobs / Services / Property sections and link into filtered category pages.
- Upload page.
- Email/password registration and login.
- Email verification gate before publishing.
- User dashboard with listing count and email verification status.
- Listing detail page with location, phone and WhatsApp action.
- Firestore security rules.
- Demo data is shown until Firebase is configured.

## Firebase setup
1. Create/choose your Firebase project.
2. Enable Authentication → Email/Password.
3. Enable Firestore.
4. Paste your Firebase web config into `firebase.js`.
5. Deploy `firestore.rules`.
6. Host the folder on GitHub Pages or another static host.

## Important
The upload form currently uses an **Image URL** field so the first version works without Firebase Storage. The supplied `storage.rules` is included if you later want direct image-file uploads.

## State routing
Examples:
- `enugu.html`
- `lagos.html`
- `rivers.html`

A state page has buttons for:
`jobs.html?state=Enugu`, `services.html?state=Enugu`, and `sale.html?state=Enugu`.

## Suggested Firestore collection
`listings`:
`type, category, subcategory, title, description, price, state, city, address, phone, imageUrl, uid, email, status, createdAt`

## Categories
Jobs: 6 main groups × 15 subcategories.
Services: 8 main groups × 15 subcategories.
For Sale: 8 main groups × 15 subcategories.

Total: 330 predefined subcategories.

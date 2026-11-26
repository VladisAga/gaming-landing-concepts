# Gaming Landing Concepts

Two interactive, mobile-first gaming landing page concepts built with HTML, SCSS and Vanilla JavaScript.

The project explores two different approaches to user engagement: an instant-reward casino experience and an interactive sports prediction flow.

## Live Demo

- **Casino:** [View Casino Demo](https://vladisaga.github.io/gaming-landing-concepts/)
- **Sports:** [View Sports Demo](https://vladisaga.github.io/gaming-landing-concepts/sports.html)

## Features

### Casino — Spin & Win

- Interactive prize wheel generated dynamically from `config.json`.
- Configurable prizes and weighted random prize selection.
- Animated spinning experience with a guaranteed prize.
- Result modal with a claim bonus action.
- Prevention of repeated spins within the same browser tab session.

### Sports — Call the Match

- Interactive match prediction with three possible outcomes: home win, draw, or away win.
- Match information, odds and bonus details loaded from configuration.
- Prediction confirmation modal with a summary of the selected outcome.
- Prevention of repeated predictions within the same browser tab session.

### Shared Features

- A/B headline testing through URL parameters.
- Configurable content and interface data through a local JSON file.
- Simulated loading state before the interface becomes interactive.
- Responsive layouts.
- Protection against repeated actions during animations and interactions.

## A/B Testing

Both concepts support two headline variations.

To test a specific variant, add the `variant` query parameter to the URL:

| Page | Variant A | Variant B |
|---|---|---|
| Casino | `?variant=A` | `?variant=B` |
| Sports | `?variant=A` | `?variant=B` |

Examples:

- [Casino — Variant A](https://vladisaga.github.io/gaming-landing-concepts/?variant=A)
- [Casino — Variant B](https://vladisaga.github.io/gaming-landing-concepts/?variant=B)
- [Sports — Variant A](https://vladisaga.github.io/gaming-landing-concepts/sports.html?variant=A)
- [Sports — Variant B](https://vladisaga.github.io/gaming-landing-concepts/sports.html?variant=B)

The selected variant changes the headline while keeping the rest of the experience consistent.

## Session Management

To prevent users from repeatedly spinning the wheel or submitting predictions, both interactions are limited to one attempt per browser tab session.

The interaction state is stored using `sessionStorage`.

This approach was intentionally chosen for the demo:
- The state survives page reloads within the same tab.
- Users cannot repeat the action simply by refreshing the page.
- The session state is normally cleared when the tab or browser session ends.

**How to reset the demo:**

If you want to test the interaction again without opening a new tab, open Developer Tools → Console and execute:

For Casino:

```js
sessionStorage.removeItem('luckyspin-played');
```

For Sports, remove the corresponding prediction storage key used in `sports.js`:

```js
sessionStorage.removeItem('sports-prediction');
```

Alternatively, you can clear the session storage for the current site through Developer Tools → Application → Session Storage.

This is a demo-level restriction. A production implementation would require server-side validation and persistent user state to prevent users from bypassing interaction limits.

## Strategy & Competitors

The concepts were selected around two common engagement patterns found in online gaming experiences: instant rewards and sports-related predictions.

Casino landing pages often rely on promotional offers, welcome bonuses and visual elements such as prize wheels to attract attention. Sports betting experiences, on the other hand, typically focus on upcoming matches, odds and the opportunity to predict an outcome.

I chose these two concepts because they demonstrate different ways of encouraging user interaction while sharing a similar promotional landing page structure.

**Casino — Spin & Win**

The goal was to create a simple, visually engaging experience with an immediate reward. Instead of presenting users with a complex interface, the page focuses on one clear action: spin the wheel and reveal a prize.

**Sports — Call the Match**

The sports concept focuses on a familiar and easy-to-understand interaction: choosing the outcome of a match. The user can compare three possible outcomes and their odds before confirming a prediction.

**My approach**

Rather than trying to reproduce a full casino or sportsbook platform, I focused on reducing friction and making the main interaction clear.

Both concepts feature:
- A single primary action and a straightforward user journey.
- Clear feedback after each interaction.
- Configurable content instead of hardcoded promotional data.
- Protection against repeated actions.
- A/B headline variations to explore different messaging approaches.

The goal was to combine familiar gaming engagement patterns with a lightweight, focused and easy-to-test landing page experience.

## Next Steps

With an additional week of development, I would focus on the following improvements:

**Responsive Design**
- Expand responsive support to more screen sizes and device configurations.
- Refine spacing, typography and component proportions across breakpoints.
- Improve the mobile experience, especially the casino wheel layout.

**Visual Improvements**
- Review and refine selected UI styles and visual details.
- Find higher-quality, better-optimized images.
- Improve image formats, compression and loading strategies.

**Technical Optimizations**
- Further optimize asset loading and overall page performance.
- Add automated tests for the main user flows and edge cases.
- Improve accessibility, including color contrast and keyboard navigation.
- Add analytics to measure user interactions and compare A/B test results.

**Product Improvements**
- Connect the demo flows to a backend API.
- Introduce persistent user state and server-side validation.
- Add real promotional campaign configuration and dynamic content management.

## Tech Stack

- HTML5
- SCSS / CSS3
- Vanilla JavaScript (ES Modules)
- JSON for configuration
- GitHub Pages for deployment

No frontend frameworks or external JavaScript libraries are used.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/VladisAga/gaming-landing-concepts.git
```

Navigate to the project directory:

```bash
cd gaming-landing-concepts
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run start
```

Open the local URL provided by the server, usually:

```text
http://127.0.0.1:3000
```

To compile SCSS during development:

```bash
npm run sass
```

To create a production CSS build:

```bash
npm run build
```

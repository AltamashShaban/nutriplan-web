# NutriPlan

A meal planner and calorie tracker that runs entirely in the browser.
No account, no server — everything you log stays on your own device.

**Live: https://YOUR-USERNAME.github.io/nutriplan-web/**

- 192 halal recipes, desi and Western, with calories and macros
- Daily targets from your height, weight, age and goal (Mifflin-St Jeor)
- A week of meals planned around your target, with swaps
- Food log with a 237-item database and portion sizes
- Exercise and step tracking that feeds back into the day's budget
- Weight and calorie charts

## What this repo is

Just the web app: one HTML file, a manifest, a service worker and icons.
Nothing to build and nothing to install — open `index.html` and it runs.

## Installing it on a phone

Open the link in Chrome or Safari, then use the browser menu and choose
"Add to Home screen". It gets its own icon, opens fullscreen, and works
offline afterwards.

## A note on the numbers

Calories and macros are calculated estimates, not laboratory measurements.
Home cooking varies a lot with oil and portion size. Treat them as a guide,
and speak to a doctor or dietitian before any big dietary change.

## Data

Stored in your browser on your device. It survives closing the app and
restarting the phone, and is lost if you clear site data or use a private
window. There's a backup export and restore under **Me → Your data**.

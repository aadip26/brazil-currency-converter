# brazil-currency-converter

Simple Node.js backend + frontend that fetches USD→BRL quotes from multiple sources and exposes three endpoints:

- `GET /api/quotes` — returns an array of quotes from sources
- `GET /api/average` — returns the average buy/sell prices
- `GET /api/slippage` — returns slippage of each source vs average (in decimal fraction)

## Quick start
1. Run:
   ```bash
   npm install
   npm start
   ```
2. Open frontend: `public/index.html` (or deploy to Render and visit the provided URL)

## Deploy to Render
1. Create a new Web Service in Render.
2. Connect your GitHub repo or upload the project.
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Render will detect `package.json` and run the start command.

## Notes
- This project uses simple server-side scraping / placeholders for some sources.
- Make sure to run `npm install` before starting.

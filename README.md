# Chat&Go — Beta Landing Page

A beta signup landing page for the Chat&Go app — real-time chat translation for 40+ languages with an AI language tutor.

## Stack

- **Frontend**: React 18 (via CDN, no build step), CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)

## Project Structure

```
├── server.js          # Express server + /api/signup endpoint
├── package.json
├── public/
│   ├── index.html     # Landing page (React + CSS)
│   └── assets/
│       ├── logo2.png
│       └── icon-192.png
└── signups.db         # Created automatically on first run (gitignored)
```

## Getting Started

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

## API

### `POST /api/signup`

Saves a beta signup to the database.

**Request body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "nativeLang": "en",
  "learnLang": "de",
  "platforms": ["ios", "android"],
  "goals": ["travel", "learn"]
}
```

**Response:**
```json
{ "success": true, "position": 42 }
```

Returns `409` if the email is already registered.

## Deployment

Deployable to Azure App Service:

```bash
az webapp up --name chatngo-landing --runtime "NODE:20-lts" --sku F1 --location westeurope
```

The `signups.db` file persists across restarts on Azure App Service (`/home/site/wwwroot`).

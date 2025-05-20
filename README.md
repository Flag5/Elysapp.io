# Elys Website

This is the official website for Elys, an AI-powered guardian companion that helps you navigate everyday life with more peace of mind, less stress, and a sense that someone's quietly looking out for you.

## About Elys

Elys is an intelligent companion that:
- Learns your routines — your commute, your devices, your charging habits, your usual gym — and is calendar aware
- Notices when something is *off* and nudges you before it becomes a problem
- Protects your privacy with encrypted data and user control
- Complements existing assistants rather than replacing them

## Features

- **Battery Awareness**: "Your phone may not have enough battery for the coming trip!"
- **Device Tracking**: "You left home without your earbuds again."
- **Calendar Awareness**: "You usually leave for your meeting by now."
- **Location Intelligence**: "You're at the airport. Your suitcase beacon hasn't moved."

## Development

This website is built with Svelte and Vite.

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

```bash
# Install dependencies
make install
```

### Development Server

```bash
# Run development server
make dev
```

This will start a development server at http://localhost:5173/

### Building for Production

```bash
# Build for production
make build
```

This will generate a `dist` directory with the production build.

### Deployment

The website is deployed to GitHub Pages.

```bash
# Deploy to GitHub Pages
make deploy
```

## Project Structure

```
Elysapp.io/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Svelte components
│   ├── App.svelte      # Main app component
│   └── main.js         # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── svelte.config.js    # Svelte configuration
└── Makefile            # Build scripts
```

## License

All rights reserved.
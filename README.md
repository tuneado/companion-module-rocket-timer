# companion-module-rocket-timer

Bitfocus Companion module for controlling the **Rocket Timer** countdown application.

## Features

- Full timer control (start, stop, pause, resume, reset, toggle)
- Time management (set time, adjust, add/subtract minutes)
- Preset loading (8 presets)
- Layout switching (classic, minimal, clockfocus, detailed, circular, video)
- Message overlays (send, show, set text, toggle)
- Sound control (mute/unmute/toggle) with muted state feedback
- Display effects (flash, feature image toggle)
- Real-time state feedback via WebSocket
- Dynamic warning color feedbacks (background and text) driven by API
- Dynamic variables for button text

## Development

```bash
# Install dependencies
npm install

# Build & package for Companion
npm run package

# Dev mode (watch for changes)
npm run dev
```

## Project Structure

```
src/
  main.js        # Module entry point (InstanceBase class)
  actions.js     # Action definitions
  feedbacks.js   # Feedback definitions
  presets.js     # Preset button definitions
  upgrades.js    # Config upgrade scripts
companion/
  manifest.json  # Module manifest (version 0.0.0 — populated by build)
  HELP.md        # User-facing help in Companion UI
```

## Installation

1. Build the module: `npm run package`
2. In Companion, go to **Connections** → **Add connection**
3. Search for "Rocket Timer"
4. Configure the host IP and ports

## API Compatibility

Requires Rocket Timer v2.0.0+ with the Unified API server enabled (REST port 9999, WebSocket port 8080).

## License

MIT

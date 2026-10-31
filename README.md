# companion-module-rocket-timer

Bitfocus Companion module for controlling the [**Rocket Timer**](https://github.com/tuneado/Rocket-Timer) countdown application.

Download Rocket Timer at [rockettimer-app.50-hz.com](https://rockettimer-app.50-hz.com).

## Features

- Full timer control (start, stop, pause, resume, reset, toggle)
- Time management (set time, adjust, add/subtract minutes)
- Preset loading (8 presets), with each button showing the preset's name and time from the app
- Layout switching (classic, minimal, clockfocus, detailed, circular, video)
- Message overlays (send, show, set text, toggle)
- Sound control (mute/unmute/toggle) with muted state feedback
- Display effects (flash, feature image toggle)
- Real-time state feedback via WebSocket
- Dynamic warning color feedbacks (background and text) driven by API
- Progress bar feedback showing remaining time
- Flash, sound and feature image presets use the same icons as the Rocket Timer app
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

Requires [Rocket Timer](https://github.com/tuneado/Rocket-Timer) v1.0.0+ with the Unified API server enabled (REST port 9999, WebSocket port 8080). Rocket Timer v1.2.4+ is needed for instant preset label updates and exact flash feedback.

Requires Bitfocus Companion 4.2 or newer.

## License

MIT

# Rocket Timer — Companion Module

This module controls the **Rocket Timer** countdown application via its REST and WebSocket APIs.

## Configuration

| Field         | Description                                  | Default   |
|---------------|----------------------------------------------|-----------|
| Host          | IP address of the Rocket Timer computer      | 127.0.0.1 |
| REST Port     | HTTP API port                                | 9999      |
| WebSocket Port| Real-time WebSocket port                     | 8080      |

## Requirements

- Rocket Timer application must be running
- API server must be enabled in Rocket Timer settings (enabled by default)
- For remote connections, enable "Allow External Connections" in Rocket Timer settings

## Available Actions

### Timer Control
- **Start Timer** — Start the countdown
- **Stop Timer** — Stop the countdown
- **Pause Timer** — Pause the running timer
- **Resume Timer** — Resume a paused timer
- **Reset Timer** — Reset to initial duration
- **Toggle Timer** — Start or pause depending on current state
- **Toggle Start/Stop** — Start or stop (not pause) depending on current state

### Time Management
- **Set Time** — Set duration using hours, minutes, seconds
- **Adjust Time** — Add or subtract time in seconds
- **Add 1 Minute** — Add 60 seconds
- **Subtract 1 Minute** — Subtract 60 seconds

### Presets
- **Load Preset** — Load a saved timer preset by ID

### Layouts
- **Change Layout** — Switch display layout (classic, minimal, clockfocus, detailed, circular, video)

### Messages
- **Send Message** — Show a message overlay with optional auto-hide
- **Show Message** — Show a persistent message
- **Set Message Text** — Set the message text without displaying it
- **Toggle Message** — Toggle message visibility

### Sound
- **Mute Sound** — Mute all timer sounds
- **Unmute Sound** — Enable timer sounds
- **Toggle Sound** — Toggle mute state

### Display Effects
- **Trigger Flash** — Flash the display with customisable cycles and duration
- **Toggle Feature Image** — Toggle background image on/off

## Feedbacks

### Boolean Feedbacks
- **Timer Running** — Changes button colour when the timer is running
- **Timer Paused** — Changes button colour when the timer is paused
- **Timer Stopped** — Changes button colour when the timer is stopped
- **Timer Overtime** — Changes button colour when the timer has gone past zero
- **Warning Level** — Changes button colour based on warning state (normal, warning, critical, overtime)
- **Sound Muted** — Changes button colour when sound is muted
- **Message Visible** — Changes button colour when the message overlay is shown
- **Feature Image Enabled** — Changes button colour when the feature image is active
- **Connection State** — Changes button colour based on connection status

### Advanced Feedbacks
- **Warning Color (Background)** — Dynamically sets button background to the current timer warning colour from the API (green → amber → red → dark red)
- **Warning Color (Text)** — Dynamically sets button text colour to the current timer warning colour from the API

## Variables

| Variable                | Description                        |
|-------------------------|------------------------------------|
| `formatted_time`        | Remaining time (HH:MM:SS)          |
| `formatted_elapsed`     | Elapsed time (HH:MM:SS)            |
| `total_seconds`         | Total duration in seconds           |
| `remaining_seconds`     | Remaining time in seconds           |
| `elapsed_seconds`       | Elapsed time in seconds             |
| `percentage`            | Remaining percentage                |
| `is_running`            | Timer running state                 |
| `is_paused`             | Timer paused state                  |
| `is_overtime`           | Overtime state                      |
| `warning_level`         | Current warning level               |
| `end_time`              | Projected end time                  |
| `timer_name`            | Active timer/preset name            |
| `state`                 | Timer state (running/paused/stopped)|
| `connection`            | Connection status                   |

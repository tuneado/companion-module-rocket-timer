# Stream Deck Icon Preparation Guide

Use this guide to prepare icon assets for Rocket Timer Companion buttons.

## 1. Export Settings

- Format: PNG with transparent background
- Size: 256x256 px
- Color space: sRGB
- Style: simple, bold, high contrast
- Safe area: keep artwork inside ~80% center to avoid clipping on Stream Deck keys
- Optional: keep source SVG files for future edits

## 2. Required State Variants

Prepare on/off or active/inactive variants for buttons that change state:

- Start + Stop
- Show Message + Hide Message
- Sound On + Sound Off
- Feature Image On + Feature Image Off
- Connection OK + Connection Error

## 3. Recommended File Naming

Use these filenames to match existing preset names:

- start_stop_on.png
- start_stop_off.png
- reset.png
- add_1_min.png
- sub_1_min.png
- add_5_min.png
- sub_5_min.png
- add_10_min.png
- sub_10_min.png
- remaining.png
- elapsed.png
- progress.png
- end_time.png
- set_message.png
- show_message.png
- hide_message.png
- sound_on.png
- sound_off.png
- flash.png
- feature_image_on.png
- feature_image_off.png
- connection_ok.png
- connection_error.png

## 4. Folder Structure

Create this structure in your icon pack:

- icons/png/*.png
- icons/svg/*.svg (optional)
- icons/map.json

## 5. Mapping File (map.json)

Create a mapping file that links each action/preset to icon files.

Example:

```json
{
  "start_stop": {
    "default": "start_stop_off.png",
    "running": "start_stop_on.png"
  },
  "toggle_message": {
    "default": "show_message.png",
    "visible": "hide_message.png"
  },
  "toggle_sound": {
    "default": "sound_on.png",
    "muted": "sound_off.png"
  },
  "toggle_feature_image": {
    "default": "feature_image_off.png",
    "enabled": "feature_image_on.png"
  },
  "connection_status": {
    "default": "connection_error.png",
    "connected": "connection_ok.png"
  }
}
```

## 6. QA Checklist

Before sending the pack for integration:

- Every PNG is 256x256 px
- Transparency is correct (no unwanted background)
- Names match exactly (including underscores)
- On/off variants are clearly distinguishable
- map.json references valid filenames
- Icons are visually legible at small sizes

## 7. Delivery

When ready, deliver:

- The full `icons/` folder
- Optional editable SVG sources
- Any style notes (color coding, icon system, stroke weight)

After delivery, the icon pack can be wired into `presets.js` and tied to feedback state changes.

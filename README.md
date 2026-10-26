# Directorate of Procurement — Chronicle of Directors

Touch-screen kiosk for the Nigerian Army Museum, chronicling the Directors of
Procurement of the Office of the Chief of Army Staff. It is a static,
offline-ready web app (no build step, no internet needed) designed for a
1920×1080 landscape display and scaled to fit any screen.

## Screens

- **Welcome**: a slowly drifting wall of every director's portrait. Any touch begins.
- **Home**: three sections — The Directorate, Chronicle of Directors, The Director.
- **The Directorate**: the brief on the directorate, one page at a time (tap, swipe or arrows).
- **Chronicle of Directors**: every director in order of succession on a
  horizontal timeline that drifts on its own, with a "line of succession" bar
  whose segments are sized to each tenure. Tap a portrait or segment for the
  full profile: appointment, service number, tenure, duration, and who
  preceded and succeeded them.
- **The Director**: the incumbent, with time in office kept up to date automatically.

After 100 seconds without a touch the kiosk returns to the welcome screen.

## Running on the kiosk

1. Copy the folder onto the kiosk PC.
2. Run `prepare.bat` once to create a Desktop shortcut (then pin it to the taskbar).
3. Launch with the shortcut or `run.bat`. It opens Microsoft Edge in full-screen kiosk mode.

For development, open `index.html` in any modern browser.

## Updating content

Everything lives in `data/content.js`:

- `brief`: the pages of the brief (heading and text).
- `directors`: the roll of directors, oldest first. Dates are `YYYY-MM-DD`,
  `to: null` marks the incumbent, and `acting: true` shows the appointment as
  Acting Director.

When a new director is appointed, set the outgoing director's `to` date and
add the new director at the end with `to: null`.

## Portraits

`directors/` holds the original portraits as supplied. The app uses the
versions in `assets/portraits/`, cropped to remove the printed caption (the app
typesets names and dates itself) and resized to 900px wide. For a new
portrait, crop off any caption, save it as a JPEG about 900px wide in
`assets/portraits/`, and point the director's `photo` at it.

## Structure

```
index.html            markup for every screen
styles.css            theme and layout
script.js             navigation, chronicle, profiles, idle reset
data/content.js       brief and roll of directors
assets/portraits/     optimised portraits used by the app
assets/fonts/         bundled Oswald, Playfair Display, Crimson Text
assets/icons/         Nigerian Army crest and app icon
directors/            original portrait files
run.bat, prepare.bat  kiosk launchers
```

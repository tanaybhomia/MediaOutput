# Media Output Switcher

A GNOME Shell extension that adds a quick menu to the top panel for changing your audio output device. 

## Features
- Shows a speaker icon in the top panel.
- Click the icon to view and switch between your connected audio output devices.
- Use a keyboard shortcut (`Super` + `A`) to open the selection menu instantly.

## Setup
1. Place this directory inside `~/.local/share/gnome-shell/extensions/media-output@tanaybhomia.github.com`
2. Compile the shortcut schema by running:
   ```bash
   glib-compile-schemas schemas/
   ```
3. Restart GNOME Shell (or log out and log back in) and enable the extension.

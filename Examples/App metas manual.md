



#### App lang, title / name, short name, description, colors, icons, screens

- Manifest
  + `html <link rel='manifest' href='...'>`
    * `html <link rel='manifest' href='/manifest.json?buildMode=development&lang=en-US'>`

- Lang
  + `html <html lang='...'></html>`
  + `manifest.lang: "..."`

- Title / Name
  + `html <title>...</title>`
  + `manifest.name: "..."`

- Short name
  + `html <meta name="apple-mobile-web-app-title" content="...">`
    * iOS launcher link name (Optional, instead of html title).
  + `manifest.short_name: "..."`

- Description
  + `html <meta name='description' content='...'/>`
  + `manifest.description: "..."`

- Colors
  + Theme color
    * `html <meta name='theme-color' content='...'/>`
    * (❓) `html <meta name='theme-color' content='...' media='(prefers-color-scheme: light)'/>`
    * (❓) `html <meta name='theme-color' content='...' media='(prefers-color-scheme: dark)'/>`
    * Android status bar color.
    * Title bar color of window.
  + iOS status bar style / color
    * `<meta name='apple-mobile-web-app-status-bar-style' content='...'>`
    * Applicable if PWA mode & manifest.display: "standalone".
    * `content='black'` - чёрный фон, белый текст
    * `content='black-translucent'` - прозрачный фон, белый текст, контент приложения заходит под статус бар.
  + Theme color (manifest)
    * `manifest.theme_color: "..."`
    * Used when html theme-color is not loaded yet.
    * Android splashscreen status bar color.
    * Title bar color of window.
  + Background color (manifest)
    * `manifest.background_color: "..."`
    * Used as window bg color when html body backgound-color is not loaded yet.
    * Android splashscreen bg color.
    * ⚠️ `html <meta name='background-color' content='...'/>` does not exist.

- Icons
  + favicon 48x48 png
    * `html <link rel='icon' type='image/png' sizes='48x48' href='/favicon-48.png'/>`
    * Tab icon in browser tab.
  + favicon svg (Optional)
    * `html <link rel='icon' type='image/svg+xml' sizes='any' href='favicon.svg'/>`
    * Desktop Chrome tab icon.

  + Apple touch icon 167x167 png
    * `html <link rel="apple-touch-icon" type="image/png" sizes="167x167" href="ipad-icon-167.png">`
    * iPad (launcher link icon, launcher PWA icon) (iOS ignores manifest icons).
  + Apple touch icon 180x180 png
    * `html <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="iphone-icon-180.png">`
    * iPhone (launcher link icon, launcher PWA icon) (iOS ignores manifest icons).

  + manifest icon 64x64 png
    * 
      ```json
      { "icons": [ {
        "src": "pwa-icon-64.png",
        "sizes": "64x64",
        "type": "image/png"
      } ] }
      ```
    * Windows / EDGE / Explorer.

  + manifest icon 192x192 png (purpose any)
    * 
      ```json
      { "icons": [ {
        "src": "pwa-icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      } ] }
      ```
    * Android / Windows.
  + manifest icon 192x192 png (purpose maskable, safe is center circle, diameter of 80% size)
    * 
      ```json
      { "icons": [ {
        "src": "pwa-icon-192-maskable.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      } ] }
      ```
    * Android.

  + manifest icon 512x512 png (purpose any)
    * 
      ```json
      { "icons": [ {
        "src": "pwa-icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      } ] }
      ```
    * Android / Windows.
  + manifest icon 512x512 png (purpose maskable, safe is center circle, diameter of 80% size)
    * 
      ```json
      { "icons": [ {
        "src": "pwa-icon-512-maskable.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      } ] }
      ```
    * Android.

- Screens
  + iOS Splashscreen
    * Need something like 
    `html <link rel="apple-touch-startup-image" media="screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_landscape.png">`
    for each iPhone / iPad precisely.
    * Image is matched by media width, height, ratio, orientation.
    * (❓) You can provide images for light / dark theme via:
    `media='(prefers-color-scheme: light)'`, `media='(prefers-color-scheme: dark)'`
    * And there are edge cases when landscape image is used as cropped portrait, etc... 
    so better use assets generator.
    * If no precise image provided, you will see white / black (depends on device theme) splashscreen.


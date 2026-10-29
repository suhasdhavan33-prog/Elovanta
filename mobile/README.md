# Elovanta Mobile (React Native + Expo)

The same backend (`../backend`) and cloud database (MongoDB Atlas) power this app — it
talks to the exact same REST API as the website, just through a native iOS/Android UI
instead of a browser. Covers: Home, Courses, Course detail, Lessons (with the "🔊 Listen"
text-to-speech button and quiz), and a Dashboard (student progress / parent view).

The admin panel (managing courses & lessons) is **web-only** — that's a desktop/content-editing
task, not something kids or parents need on their phone. Use the website for that.

## Why Expo / React Native instead of separate Swift + Kotlin apps

One JavaScript codebase builds both the iOS and Android app, reusing the same patterns as
the web frontend (React, hooks, the same API). Expo's cloud build service (EAS, see below)
can even produce the iOS binary without you owning a Mac.

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A phone with the **[Expo Go](https://expo.dev/go)** app installed (free, from the App
  Store / Play Store) — the fastest way to run this on a real device with no build step
- The backend running somewhere reachable from your phone (locally on your LAN, or already
  deployed to Render per the main [README](../README.md#deploying-to-the-cloud))

## 2. Create the Expo project and copy in this code

Expo projects are version-sensitive, so rather than hand-installing exact package versions,
scaffold a fresh project and let Expo pick versions that match its current SDK:

```bash
npx create-expo-app@latest elovanta-mobile --template blank
cd elovanta-mobile
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-svg @react-native-async-storage/async-storage expo-speech expo-splash-screen axios
npm install -D sharp
```

Then copy these files from this `mobile/` folder into your new `elovanta-mobile` project,
overwriting the generated placeholders:

- `App.js`
- `app.json`
- `eas.json`
- `src/` (the whole folder)
- `assets/logo-source.svg`
- `scripts/generate-icons.js`
- `.env.example` → copy to `.env` and edit it

## 3. Generate the app icons

```bash
npm run generate:icons
```

This rasterizes `assets/logo-source.svg` (the same Elovanta mark used on the website) into
`icon.png`, `adaptive-icon.png`, `splash-icon.png`, and `favicon.png` — the exact files
`app.json` references.

## 4. Point the app at your backend

Edit `.env`:

```
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

> `localhost` only resolves on an iOS Simulator / Android Emulator running on the same
> machine as the backend. For a physical phone, either use your deployed Render URL (works
> from anywhere, simplest) or your computer's LAN IP (e.g. `http://192.168.1.50:5000/api`)
> if you want to test against a backend running locally.

## 5. Run it

```bash
npx expo start
```

Scan the QR code with the Expo Go app (Android: in-app scanner; iOS: the Camera app) to run
it on your phone instantly — no Xcode or Android Studio required for this step.

## 6. Building real app binaries & store hosting — EAS

[Expo Application Services (EAS)](https://expo.dev) is Expo's cloud build + submission
service: it builds your `.apk`/`.aab` (Android) and `.ipa` (iOS) on Expo's servers — so you
don't need a Mac even for the iOS build — and can submit them straight to the Play Store /
App Store.

```bash
npm install -g eas-cli
eas login
eas build:configure
```

**Share an installable test build** (no store account needed yet):

```bash
eas build --profile preview --platform android
```

This uploads to Expo's cloud, builds it, and gives you a link to download an installable
APK directly — share that link with anyone for testing.

**Build store-ready binaries:**

```bash
eas build --profile production --platform all
```

**Submit to the stores** (after you've created the developer accounts — see below):

```bash
eas submit --platform android
eas submit --platform ios
```

`eas submit` will prompt you for your own Play Console / App Store Connect credentials and
API keys interactively — enter those yourself when asked; this isn't something that can be
scripted on your behalf.

**Ship a JS-only fix instantly, without a new store review:**

```bash
eas update --branch production
```

### Accounts you'll need to create yourself (one-time, before publishing)

| Account | Cost | Needed for |
|---|---|---|
| [Expo](https://expo.dev/signup) | Free | `eas build` / `eas update` |
| [Google Play Console](https://play.google.com/console/signup) | $25 one-time | Publishing to Android |
| [Apple Developer Program](https://developer.apple.com/programs/enroll/) | $99/year | Publishing to iOS |

## Before you publish: this is a kids' app

Because Elovanta targets children under 13, both stores apply extra rules on top of normal
review — this isn't optional polish, it affects whether the app gets approved at all:

- **Google Play Families Policy** — apps primarily for children must declare their target
  age group in Play Console and follow the [Families Policy](https://support.google.com/googleplay/android-developer/answer/9893335) (restricted ad SDKs, no social features without safeguards, etc.)
- **Apple Kids Category** — similar restrictions if you list under Apple's Kids category;
  see [Apple's Kids Category guidelines](https://developer.apple.com/app-store/review/guidelines/#kids-category)
- **COPPA** (US) / similar children's privacy laws elsewhere — you'll need a privacy policy
  describing exactly what data is collected (this app currently collects: name, email,
  age, and quiz progress) and, practically, verifiable parental consent for account creation
- A **parental gate** before anything like external links, purchases, or account deletion is
  common practice even where not strictly required

This is a lot to get right for a commercial launch — treat the above as a starting checklist,
and consider consulting a lawyer familiar with children's digital privacy law before
publishing publicly, not just as code review feedback.

## Project structure

```
mobile/
  App.js                    Entry point
  app.json                  Expo config (name, icons, bundle IDs)
  eas.json                  EAS Build/Submit profiles
  scripts/generate-icons.js Rasterizes the logo into app icon assets
  assets/logo-source.svg    Source logo (same mark as the website favicon)
  src/
    api/axios.js             Axios instance, reads EXPO_PUBLIC_API_URL
    context/AuthContext.js   Auth state, persisted via AsyncStorage
    theme/colors.js           Shared color tokens (mirrors the website's CSS variables)
    components/              Logo, buttons, cards, quiz, speak button, etc.
    navigation/               Bottom tabs (Home / Courses / Account), each with its own stack
    screens/                  One file per screen
```

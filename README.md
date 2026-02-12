# Quran Pesat

Quran Pesat is a modern, open-source Quran application built with React Native and Expo. It provides a beautiful, fast, and user-friendly experience for reading, searching, and bookmarking Quranic verses, as well as accessing Islamic articles, prayer times, and notifications—all in one place.

## ✨ Features

- **Al-Quran**: Read the full Quran with translation, per-ayat audio, and search.
- **Bookmark Ayat**: Save and manage favorite ayat locally (AsyncStorage).
- **Article/News**: Browse Islamic articles and news with category filters and lazy loading.
- **Prayer Times**: View daily prayer times based on your location.
- **Notifications**: See app notifications and manage notification settings.
- **Settings**: Clean, grouped settings page with toggles, links, and profile/login.
- **Modern UI**: Floating tab bar, running-text category filter, and platform-specific polish.
- **Offline Support**: Bookmarks and Quran data available offline.

## 📱 Screenshots

_Add screenshots here if available_

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

3. **Open on your device**
   - Scan the QR code with [Expo Go](https://expo.dev/go) (Android/iOS)
   - Or run on an emulator: `npx expo start --android` or `npx expo start --ios`

## 🛠️ Project Structure

- `app/` — Main app screens and navigation (Expo Router)
- `components/` — Reusable UI components
- `hooks/` — Custom React hooks (e.g., bookmarks, prayer times)
- `data/` — Static data (e.g., menu, provinces)
- `constants/` — Theme and config constants
- `style/` — Global styles (Tailwind CSS)
- `assets/` — Images and icons

## 🧩 Key Technologies

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Tailwind CSS (NativeWind)](https://www.nativewind.dev/)
- [Lucide React Native Icons](https://lucide.dev/icons/)

## ⚙️ Scripts

- `npm start` — Start Expo development server
- `npm run android` — Run on Android emulator/device
- `npm run ios` — Run on iOS simulator/device
- `npm run web` — Run on web
- `npm run lint` — Lint code
- `npm run reset-project` — Reset to a fresh project state

## 📦 Dependencies

See `package.json` for the full list of dependencies.

## 🙏 Credits

- Built by [@raple](https://github.com/raple)
- Quran data from [Kemenag API](https://quran.kemenag.go.id/) and open sources
- Article/news via RSS2JSON API

## 📄 License

MIT

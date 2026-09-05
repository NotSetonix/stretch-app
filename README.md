## Sprint 2 — API and Persistence

### REST API

Stretch data lives on a MockAPI resource rather than in the app bundle.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/stretches` | Load the library |
| POST | `/stretches` | Add a stretch |
| PUT | `/stretches/:id` | Edit a stretch |
| DELETE | `/stretches/:id` | Remove a stretch |

All network calls go through `lib/api.js`, which wraps `fetch` with a shared
timeout and status check. Screens never call `fetch` directly.

### Local persistence

After every successful load and every write, the stretch list is saved to
AsyncStorage (`lib/storage.js`). If the server cannot be reached, the app falls
back to that saved copy and shows an offline banner. If there is no saved copy
either, an error screen with a retry button is shown instead.

### State management

`lib/stretches-store.js` holds the list in a React context so Home, Detail and
the form screen all read and write the same data. It exposes the list plus
`loading`, `error` and `usingCache` flags, and the four CRUD actions.

### Screens

- **Home** — filterable FlatList with loading, empty, error and offline states
- **Detail** — full instructions, with Edit and Delete
- **Add / Edit** — one form screen; creates with POST when opened without an id, updates with PUT when opened with one
- **Settings** — display toggles, cache status, clear cache, and restore the built-in stretches

## Setup Instructions

1. Clone the repository:
   `git clone https://github.com/NotSetonix/stretch-app.git`
2. Install dependencies:
   `npm install`
3. Create a MockAPI project at https://mockapi.io with a `stretches` resource
   (fields: name, area, seconds, difficulty, summary, steps, commonMistake).
4. Put your MockAPI base URL in `constants/api.js`.
5. Start the development server:
   `npx expo start`
6. Scan the QR code with Expo Go, or press `a` for an Android emulator.

On first run the resource is empty, so open **Settings → Restore default
stretches** to upload the twelve built-in stretches.

Requires Node.js (LTS) and Expo Go.
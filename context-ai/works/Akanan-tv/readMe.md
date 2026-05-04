# AkananTv Desktop (`akanantv-sys`)

Desktop-first business app for **inventory, sales, customers, suppliers**, and related operations for a TV / electronics retail context. The UI is **React + Vite**; persistence and file access run through **Electron** with **LowDB** (JSON file) and IPC.

**Product name (packaged build):** AkananTv Desktop  
**App ID:** `com.akanan-sys.akanan-desktop`

---

## Features (high level)

| Area | What it does |
|------|----------------|
| **Inventory** | Tabs for **general items**, **remotes**, **boards**, **LED bars**, and **TV archive** (models). TV brands management, filters, pagination, image lightbox, Excel import helpers (see `src/pages/Inventory/components/README_ExcelImport.md`). |
| **Sales** | Orders, payments, receipts (print via main process), statistics, calendar view, unpaid orders, returns/refunds (IPC). |
| **Customers** | Customer list, profiles, order history views. |
| **Suppliers** | Suppliers, supplier orders, insights. |
| **Settings** | Language, theme, PIN / private mode, order card layout, data **backup export/import** (ZIP, optional AES-style encryption). |
| **Security** | PIN stored in DB; **private mode** after successful PIN; **protected routes** for sensitive sections; session refresh / timeout behavior in `SecurityContext`. |

**Note:** The `expenses` collection exists in the database schema, and `/expenses` is a protected route, but the **Expenses page is a placeholder** and the sidebar link is commented out—implementation is pending.

---

## Tech stack

- **UI:** React 18, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`), Radix UI + shadcn-style components (`src/components/ui/`)
- **Charts / UX:** Recharts, Framer Motion, Sonner (toasts), `yet-another-react-lightbox`
- **Desktop:** Electron 36, **electron-builder** (Windows NSIS, Linux AppImage/deb, macOS category)
- **Data:** [lowdb](https://github.com/typicode/lowdb) v7 + JSON file adapter (`src/services/dbService.js`), read/write from **main process** via IPC
- **Build:** Vite 6, `@vitejs/plugin-react-swc`

---

## Requirements

- **Node.js** (LTS recommended) and npm  
- For **full functionality**, run the app **inside Electron** (`electron:dev` or a built installer). The renderer expects `window.electron` (preload bridge) for all database and filesystem operations.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server only (`--host`; default port **5173**) — UI loads, but **without Electron most data APIs are unavailable** |
| `npm run electron:dev` | Vite + Electron: waits for `http://localhost:5173`, opens app with `ELECTRON_START_URL` |
| `npm run build` | Production Vite build → `dist/` |
| `npm run electron:build` | `vite build` then **electron-builder** → output under `electron-dist/` |
| `npm run preview` | Preview production build (web) |
| `npm run lint` | ESLint |

---

## Running in development (recommended)

```bash
npm install
npm run electron:dev
```

DevTools open automatically when using `ELECTRON_START_URL`.

---

## Data storage

### Database file (`db.json`)

Managed by **LowDB** in `src/services/dbService.js`:

- **Development** (`NODE_ENV === 'development'`): `db.json` at the **project root** (resolved path).
- **Production Electron**: `db.json` under the OS **user data** directory (`app.getPath('userData')`).

Default / expected top-level keys in `db.data` include:

| Key | Role |
|-----|------|
| `items` | Inventory rows (scoped by `itemCategory`: `general`, `remotes`, `boards`, `led_bars`, etc.) |
| `tvArchive` | TV model archive |
| `sales` | Sales orders |
| `customers` | Customers |
| `expenses` | Reserved; UI not fully implemented |
| `suppliers` | Suppliers |
| `pin` | Private mode PIN (simple encoding in app layer) |
| `settings` | e.g. `orderCardVariant`; merged with UI prefs in `SettingsContext` |

All mutations from the **main process** should end with `await lowDb.write()` (or `dbService.write()` where used).

### Item images

Stored on disk under:

`app.getPath('userData')/images/{itemId}/`

The database stores **relative paths** (normalized with forward slashes), not absolute paths.

### Backup & restore

From **Settings → Data management**: export/import a **ZIP** containing `db.json` (or `db.json.encrypted` + `encrypted.flag`) and optionally an `images/` tree. Import replaces DB and images and **relaunches** the app (`electron-main.cjs`).

---

## Architecture overview

```
Renderer (React)
  └── window.electron.*  ← contextBridge in electron-preload.cjs
        └── ipcMain handlers in electron-main.cjs + src/main/*.cjs
              └── lowdb (db.json) + fs (images, print templates)
```

- **Entry (web):** `src/main.jsx` → `App.jsx`
- **Entry (Electron):** `electron-main.cjs` (loads `dist/index.html` or dev server URL)
- **Preload:** `electron-preload.cjs` exposes the `electron` API (no `nodeIntegration` in renderer)

### Routing

`src/DynamicRouter.jsx`:

- **Electron:** `HashRouter` (file/protocol friendly)
- **Web (Vite only):** `BrowserRouter`

Routes are declared in `src/App.jsx` (e.g. `/inventory`, `/sales`, `/customers`, `/customers/:id`, `/expenses`, `/suppliers`, `/settings`). There is **no default `/` route** defined; navigate via sidebar or direct hash path in Electron (e.g. `#/inventory`).

### Main-process modules (`src/main/`)

| Module | Responsibility (summary) |
|--------|----------------------------|
| `item-handlers.cjs` | Items CRUD, images, category exports |
| `tv-archive-handlers.cjs` | TV archive CRUD + images |
| `tv-brand-handlers.cjs` | TV brands |
| `customer-handlers.cjs` | Customers |
| `sales-handlers.cjs` | Sales orders, date/customer queries, returns |
| `supplier-handlers.cjs` | Suppliers + supplier orders |
| `settings-handlers.cjs` | Persisted settings |
| `printing-handlers.cjs` | Receipt printing (`receipt-template.html`) |
| `image-handlers.cjs` | Image-related IPC |

---

## Security model (app-level)

- **PIN** is read/written via generic IPC `db-get` / `db-set` on key `pin`.
- On first run, logic in `SecurityContext` may initialize a **default PIN** (`0000`, stored as Base64—**not** a strong cryptographic design; treat as **obfuscation / casual lock** only).
- **`ProtectedRoute`** wraps Sales, Expenses, and Suppliers; combined with **`requiresAuthentication`** paths: `/sales`, `/expenses`, `/suppliers`.
- **Private mode** (`activatePrivateMode`) unlocks protected areas after successful PIN; **startup** can show PIN modal when a PIN exists and user is not yet authenticated.

---

## UI conventions (project rules)

- **Bilingual:** Arabic / English via `src/contexts/LanguageContext.jsx` (`t()`, `direction`, `isArabic`).
- **Theme:** Light/dark via `ThemeContext` + `next-themes`-style usage in settings.
- **Styling:** Tailwind with explicit dark-mode and contrast-friendly palette patterns (see `.cursor/rules/project-rules.mdc`).

---

## Path aliases

Vite resolves `@/` → `src/` (`vite.config.js`).

---

## Project layout (abbreviated)

```
akananTv-sys-1/
├── electron-main.cjs          # Main process: window, DB init, backup IPC, db-get/set
├── electron-preload.cjs       # contextBridge API
├── index.html
├── package.json
├── vite.config.js
├── dist/                      # Vite output (after build)
├── electron-dist/             # electron-builder output
├── src/
│   ├── App.jsx
│   ├── DynamicRouter.jsx
│   ├── main.jsx
│   ├── contexts/              # Language, Theme, Security, Settings
│   ├── components/          # Layout, sidebar, security, ui/
│   ├── pages/
│   │   ├── Inventory/
│   │   ├── Sales/
│   │   ├── Customers/
│   │   ├── Expenses/        # Placeholder page
│   │   ├── Suppliers/
│   │   └── Settings/
│   ├── main/                  # Electron IPC handlers (.cjs)
│   └── services/
│       ├── dbService.js       # LowDB (used from main / Node)
│       └── enviroment.js      # isElectron() helper (filename spelling as in repo)
```

---

## Contributing / extending

- Prefer **IPC + main handlers** for new persistence or filesystem work; keep the renderer on `window.electron`.
- After any in-memory mutation of `lowDb.data`, persist with **`await lowDb.write()`**.
- New **React pages** should follow `src/pages/<Name>/<Name>Page.jsx` and use existing layout, i18n, and theme patterns.
- If you add **new DB top-level keys** or change schemas significantly, align with team conventions and update this README.

---

## Author

Ashraf Swaidan — see `package.json` `author` field for contact string.

---

## License

`"private": true` in `package.json` — distribution/licensing is project-specific; not published as a public npm package.

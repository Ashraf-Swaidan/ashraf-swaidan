# AkananTv Desktop - Portfolio Project Brief

Use this document as context when asking another AI to generate portfolio content about this project.

---

## 1) Project Identity

- **Project name:** AkananTv Desktop
- **Type:** Desktop business management system (Electron + React)
- **Domain:** TV/electronics retail operations
- **Primary goal:** Centralize daily operations (inventory, sales, customers, suppliers, and settings) into one offline-friendly desktop workflow.

---

## 2) Problem This System Solves

Small retail operations often run on fragmented tools (paper notes, spreadsheets, ad-hoc messaging), which causes:

- inventory inaccuracies,
- weak traceability between sales and stock movement,
- difficult customer follow-up,
- limited visibility into unpaid orders and performance trends.

This system addresses those issues with one connected operational desktop application built for real, day-to-day shop usage.

---

## 3) Core Capabilities

- **Inventory management:** multiple item categories (general, remotes, boards, LED bars) plus TV archive and brand management.
- **Sales workflow:** create and edit orders, manage partial/full payments, track unpaid orders, handle returns, and print receipts.
- **Customer management:** customer records, profile pages, and order history views.
- **Supplier management:** suppliers, supplier orders, and supplier insights.
- **Data continuity:** export/import backup as ZIP (optional encryption), including database and images.
- **Security/privacy:** PIN-based protected areas and private mode for sensitive data exposure control.
- **Bilingual UX:** Arabic/English with runtime direction switching (RTL/LTR).
- **Theme support:** light/dark mode with consistent UI patterns.

---

## 4) Technical Highlights ("Power Points")

### A) Production-Ready Desktop Architecture
- React renderer is isolated from Node and accesses OS/data features via a secure Electron preload bridge (`window.electron`).
- Business/data operations run in Electron main-process IPC handlers for cleaner separation of concerns.

### B) Practical Data Layer for SMB Context
- Uses LowDB (JSON-backed persistence) for simplicity, portability, and straightforward backups.
- Designed for real shop workflows where easy restore/export is critical.

### C) File + Data Integration
- Stores item images in user data directories and keeps relative references in DB.
- Supports complete operational snapshots (DB + images) for migration/recovery.

### D) Workflow-Centric Feature Design
- Payment tracking (full/partial), due dates, unpaid orders, and returns align with real retail cash flow behavior.
- Receipt printing and calendar/statistics views support operational speed and decision-making.

### E) Localization Beyond Translation
- Includes Arabic/English content with direction-aware layout behavior.
- Important for bilingual environments where many systems fail in true RTL usability.

---

## 5) System Architecture Summary

High-level flow:

1. React UI renders pages and triggers actions.
2. UI calls `window.electron.*` methods from preload.
3. Electron main process handles IPC commands.
4. Main process reads/writes LowDB and filesystem resources (images, backups, printing).

Key stack:

- **Frontend:** React 18, React Router, Tailwind CSS, Radix/shadcn-style UI
- **Desktop shell:** Electron
- **Persistence:** LowDB JSON database
- **Packaging:** electron-builder (Windows/macOS/Linux targets configured)

---

## 6) Notable Engineering Decisions

- **Desktop-first design:** chosen to support local operation and direct filesystem/printing workflows.
- **IPC modularization:** domain handlers separated by area (items, sales, customers, suppliers, settings, printing).
- **Protected routes + private mode:** implemented to gate sensitive business sections.
- **Backup strategy:** one-click export/import with optional encrypted database packaging.
- **Route strategy by environment:** hash routing in Electron context and browser routing for web/dev context.

---

## 7) Feature Depth That Stands Out in Portfolio

- Inventory is not a basic list: category-specific handling, filtering, image support, and TV model linking.
- Sales is not CRUD-only: payment states, due-date logic, unpaid workflows, and return handling.
- Settings are operationally meaningful: language, theme, PIN/privacy, and data portability.
- Architecture demonstrates both UI craftsmanship and practical desktop-system engineering.

---

## 8) Honest Scope Notes

- The `expenses` data path/route exists, but the Expenses page is currently a placeholder (full implementation pending).
- PIN storage is currently app-level obfuscation, not enterprise-grade cryptographic credential storage.

---

## 9) Suggested Portfolio Positioning (copy-ready)

> I built a desktop operations platform for a TV/electronics retail workflow using React and Electron.  
> The system unifies inventory, sales, customer and supplier management with bilingual Arabic/English UX, protected private mode, and complete data portability through backup/restore.  
> Architecturally, I separated renderer and system-level logic through IPC modules, then implemented a practical local-first persistence model with image/file handling and production packaging.

---

## 10) AI Prompt Block (for your portfolio assistant)

Use this prompt with another AI and attach this repository/folder:

```text
You are helping me write a portfolio case study for this project.

Project: AkananTv Desktop
Type: Electron + React desktop business system for TV/electronics retail.

Please produce:
1) A concise case study (problem -> solution -> architecture -> impact)
2) A "key features" section focused on business value
3) A "technical highlights" section focused on engineering decisions
4) A "challenges and trade-offs" section with honest scope notes
5) A short "my role and ownership" section in first-person tone
6) A resume-ready project bullet list (5-7 bullets)

Important constraints:
- Keep claims realistic; do not invent metrics.
- Mention bilingual (Arabic/English) support and desktop-first architecture.
- Mention backup/import-export and protected private mode.
- Mention that Expenses is currently a placeholder.
- Keep writing professional, clear, and recruiter-friendly.
```


# nostr_client_ghost 🧿

A minimalist Nostr client built with React, TypeScript, Vite, and Mantine UI.  
This project explores the decentralized social protocol [Nostr](https://nostr.com/) through a clean, modern frontend experience.

---

## 🚀 Tech Stack

- **React** – Frontend library
- **TypeScript** – Type safety
- **Vite** – Lightning-fast dev environment and bundler
- **Mantine** – UI components and styling
- **nostr-tools** – Nostr protocol utilities
- **Redux** – Scalable state management with centralized store

---

## 📁 Project Structure

```plaintext
src/
├── components/       # Reusable UI components (e.g., layout, buttons)
├── pages/            # Page-level components and routes
├── services/         # Business logic (e.g., Nostr interactions)
├── utils/            # Utility functions
├── store/            # Redux store and slices
├── assets/           # Static images, icons, etc.
├── App.tsx           # Main app entry point
└── main.tsx          # Mounts React app to the DOM
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DanielKanyo/nostr_client_ghost.git
cd nostr_client_ghost
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Start the development server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

---

## ✨ Features

- 🔑 Generate and manage Nostr keys (private/public)
- 📤 Publish and subscribe to events via Nostr relays
- 📄 View event history and real-time updates
- 🌗 Responsive and clean UI with Mantine
- ⚡ Blazing fast with Vite and modular architecture

---

## 📝 License

MIT License

---

## 💡 About Nostr

Nostr (Notes and Other Stuff Transmitted by Relays) is a censorship-resistant protocol for building decentralized social networks.  
Learn more at [https://nostr.com](https://nostr.com).

---

## 🙌 Acknowledgements

- [nostr-tools](https://github.com/fiatjaf/nostr-tools)
- [Mantine UI](https://mantine.dev/)
- [Vite](https://vitejs.dev/)
- [Redux](https://redux.js.org/)

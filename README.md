# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

This project uses [file-based routing](https://docs.expo.dev/router/introduction) powered by Expo Router.

---

## Project Overview

**MyHomeLibrary** is a React Native app for managing your digital book library.  
It uses SQLite with Drizzle ORM for local data storage and features smooth navigation with Expo Router.

---

## Getting Started

### Prerequisites
- Node.js and npm installed  
- Expo CLI (`npm install -g expo-cli`)  
- EAS CLI for builds (`npm install -g eas-cli`)  
- Android/iOS emulator or physical device  


### Installation
```bash
npm install
```




## Project Structure

- **app/** — Main app folder with route-based screens  
  - `_layout.tsx` — Root layout file  
  - `(tabs)/` — Tab navigation group  
    - `_layout.tsx` — Tabs layout  
    - `(books)/` — Book-related screens  
      - `index.tsx` — Home/book list screen  
      - `updatebook.tsx` — Screen to update a book  
    - `(manage)/` — Management screens for authors, genres, series, and database  
      - `_layout.tsx`  
      - `authors.tsx` — Manage authors  
      - `genres.tsx` — Manage genres  
      - `series.tsx` — Manage series  
      - `database.tsx` — Database utilities screen for downloading or uploading a db.
      - `index.tsx` —  Landing screen
      - `update.tsx` — Dynamic Update screen updating either an author, genre or series 
      - `(add)/` — Screens for addings authors, genres and series  
    - `addBook.tsx` — Add new book screen  
    - `search.tsx` — Search books screen  
- **components/** — Reusable UI components  


---

## Features

- View, add, update, and delete books locally  
- Manage authors, genres, and series  
- Local SQLite data persistence using `expo-sqlite` and Drizzle ORM  
- Themed UI components and smooth navigation with Expo Router  




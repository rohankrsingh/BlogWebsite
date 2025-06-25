# BlogWebsite

A modern, full-stack blog platform built with **React**, **Redux Toolkit**, **Appwrite**, **Tailwind CSS**, **HeroUI**, and **Framer Motion**. This project demonstrates a scalable, feature-rich blogging experience with authentication, post management, user profiles, dynamic homepage sections, and a beautiful, responsive UI.

---

## 🚀 Features

- **Authentication**: Secure sign up, login, and logout with Appwrite Auth.
- **Post Management**: Create, edit, delete, and view blog posts with Markdown support.
- **Dynamic Homepage**: 
  - **Featured Posts**: Highlighted by popularity (likes).
  - **Latest Posts**: Most recent posts.
  - **Popular Tags**: Interactive tag-based filtering using HeroUI Tabs.
  - **Editor’s Picks**: Curated posts marked by editors.
- **Likes**: Users can like posts; like counts are displayed and used for featured sorting.
- **User Profiles**: View and edit profile info, including avatar selection.
- **Theming**: Light/dark mode and accent color customization.
- **Responsive Design**: Mobile-first, adaptive layouts.
- **Modern UI**: Built with Tailwind CSS, HeroUI components, and Framer Motion animations.
- **Client-side Tag Aggregation**: Tags are extracted from posts on the client for filtering and display.

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, HeroUI, Framer Motion
- **Backend/Services**: Appwrite (Database, Auth, Storage)
- **Styling**: Tailwind CSS, PostCSS
- **Build Tool**: Vite

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── appwrite/         # Appwrite config & service methods
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI & layout components
│   │   ├── ui/           # UI primitives (Button, Card, etc.)
│   │   ├── post-form/    # Post creation/editing
│   │   ├── settings/     # Profile & customization
│   │   ├── magicui/      # Animated UI elements
│   │   ├── Footer/       # Footer component
│   │   └── Header/       # Header & navigation
│   ├── conf/             # App configuration
│   ├── lib/              # Utility functions
│   ├── pages/            # Route pages (Home, Post, Login, etc.)
│   └── store/            # Redux slices & store setup
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
├── vite.config.js        # Vite build config
├── package.json          # Project metadata & scripts
└── README.md             # Project documentation
```

---

## 🏠 Homepage Sections

- **Featured**: Top 3 posts by likes.
- **Latest**: 6 most recent posts.
- **Popular Tags**: Tabs for top tags (aggregated from latest 20 posts), with filtered post lists.
- **Editor’s Picks**: Up to 4 posts marked as `editor_pick`.

All sections are powered by Redux and Appwrite queries for efficient data fetching and state management.

---

## 🔒 Authentication & User Management

- **Sign Up / Login**: Email/password via Appwrite Auth.
- **Profile**: Update avatar, display name, and theme preferences.
- **Protected Routes**: Authenticated access to post creation/editing.

---

## 📝 Post Features

- **Markdown Editor**: Rich text editing for posts.
- **CRUD Operations**: Create, read, update, delete posts (with Appwrite DB).
- **Likes**: Like/unlike posts, with real-time count updates.
- **Tagging**: Add tags to posts; tags are used for filtering and discovery.

---

## 🎨 Theming & UI

- **Light/Dark Mode**: Toggleable theme.
- **Accent Colors**: Selectable accent color for personalization.
- **HeroUI Tabs**: For tag navigation and filtering.
- **Framer Motion**: Smooth UI animations.

---

## ⚡ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/BlogWebsite.git
cd BlogWebsite
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure Appwrite**

- Create a [free Appwrite project](https://appwrite.io/).
- Set up Database, Auth, and Storage as per your needs.
- Copy your Appwrite endpoint, project ID, and API keys.
- Update `/src/appwrite/config.js` and `/src/conf/conf.js` with your Appwrite credentials:

```js
// src/appwrite/config.js
export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = 'your_project_id';
// ...other config
```

### 4. **Run the App Locally**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. **Build for Production**

```bash
npm run build
```

---

## 🌐 Deployment

- Deploy on [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or your preferred platform.
- Set environment variables for Appwrite credentials in your deployment dashboard.

---

## 🙋‍♂️ Contact

For questions, suggestions, or feedback:
- Open an issue on GitHub
- Contact [Rohan](rohankrsingh125@gmail.com)

---

**Showcase your creativity and build your own blog with this modern, full-stack template!**

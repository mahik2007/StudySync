# 📚 StudySync — Smart Study Tracker Dashboard

<div align="center">

![StudySync Banner](src/assets/hero.png)

### Elevate your academic productivity with an intelligent, gamified study suite.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=for-the-badge)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[**Live Demo**](https://mahik2007.github.io/StudySync) • [**Features**](#-features) • [**Quick Start**](#-quick-start) • [**Architecture**](#-project-architecture) • [**Contributing**](#-contributing)

</div>

---

## 🌟 Overview

**StudySync** is an all-in-one productivity and academic habit management platform built for modern learners. Combining intelligent time-blocking, gamified progress incentives, deep habit analytics, and automated streak tracking, StudySync transforms daunting workloads into structured, rewarding study sessions.

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>⏱️ Focus Pomodoro Timer</h3>
      <ul>
        <li>Configurable Focus, Short Break, and Long Break intervals.</li>
        <li>Ambient soundscapes (Rain, Lo-Fi, White Noise, Library, Cafe).</li>
        <li>Auto-logs minutes directly into weekly progress reports and XP counters.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🌱 Interactive Habit Tracker</h3>
      <ul>
        <li>Visual streak tracking with continuous completion history.</li>
        <li>Daily check-ins with category filters (Study, Practice, Coding).</li>
        <li>Automated streak preservation with completion safeguards.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📋 Intelligent Task Manager</h3>
      <ul>
        <li>Priority tagging (<code>High</code>, <code>Medium</code>, <code>Low</code>) and subject categorization.</li>
        <li>Filter by status, search queries, and deadline sort orders.</li>
        <li>Quick completion toggling synced to XP and daily accomplishment feed.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Deep Analytics & Reports</h3>
      <ul>
        <li>Interactive study distribution charts powered by <b>Recharts</b>.</li>
        <li>Weekly study hours trends, completion ratios, and peak productivity heatmaps.</li>
        <li>Category breakdown charts for balanced subject learning.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎯 Goal Planner & Milestones</h3>
      <ul>
        <li>Break down semester goals into actionable percentage milestones.</li>
        <li>Target date countdowns and automated status updates.</li>
        <li>Tagging across Academic, Skills, and Exam categories.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🏆 Gamification & Achievements</h3>
      <ul>
        <li>Level up and unlock badges (<i>Focus Pioneer</i>, <i>Midnight Scholar</i>, <i>Grandmaster</i>).</li>
        <li>Earn XP for every completed task, Pomodoro interval, and habit streak.</li>
        <li>Real-time progression rings and level celebration banners.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Academic Calendar View</h3>
      <ul>
        <li>Monthly and weekly perspectives of deadlines and scheduled sessions.</li>
        <li>Color-coded indicator dots for subjects and priorities.</li>
        <li>One-click drill-down to daily workloads.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🎨 Customization & Accessibility</h3>
      <ul>
        <li>Seamless Dark / Light Mode with instant CSS variable transitions.</li>
        <li>Fully responsive design tailored for smartphones, tablets, and wide monitors.</li>
        <li>Fluid page transitions orchestrated by <b>Framer Motion</b>.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism UI
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: React Context API (`StudyContext`) with persistent `localStorage` synchronization
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & Google Material Symbols

---

## 🚀 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

```bash
# Verify Node.js version
node -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahik2007/StudySync.git
   cd StudySync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the application:**
   Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📁 Project Architecture

```
StudySync/
├── public/                 # Static assets & SVG icons
├── src/
│   ├── assets/             # Brand logos & preview graphics
│   ├── components/         # Reusable UI components & Layout wrappers
│   │   ├── Layout.jsx      # Navigation, Header, Sidebar & Theme switcher
│   ├── context/            # Global application state & persistence
│   │   ├── StudyContext.jsx# Core state: habits, tasks, pomodoro, XP & badges
│   │   └── useStudy.js     # Custom hook for context consumption
│   ├── pages/              # Application views & route targets
│   │   ├── LandingPage.jsx # Hero showcase, testimonials & feature highlights
│   │   ├── Dashboard.jsx   # At-a-glance metrics, quick timers & daily schedule
│   │   ├── HabitTracker.jsx# Habit streak management & check-in matrix
│   │   ├── TaskManager.jsx # Kanbans/lists with priority filters & deadlines
│   │   ├── Pomodoro.jsx    # Audio-enabled timer with custom durations
│   │   ├── Analytics.jsx   # Interactive charts & productivity insights
│   │   ├── GoalPlanner.jsx # Milestone progress tracker & target manager
│   │   ├── CalendarView.jsx# Month-to-month deadline scheduling
│   │   ├── Achievements.jsx# XP progression, badges & rewards hall
│   │   ├── Settings.jsx    # User preferences, data backup & reset options
│   │   ├── Login.jsx       # Authentication entry
│   │   └── Register.jsx    # New student registration
│   ├── App.jsx             # Route definitions & Framer Motion transitions
│   ├── index.css           # Tailwind CSS directives & theme design tokens
│   └── main.jsx            # React root mounting
├── index.html              # HTML5 entry with web fonts
├── package.json            # Scripts & project dependencies
└── vite.config.js          # Vite build configuration
```

---

## ⚙️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on `localhost:5173` |
| `npm run build` | Compiles an optimized production build into `/dist` |
| `npm run preview`| Spawns a local static server to test the `/dist` production build |
| `npm run lint` | Runs ESLint to identify code quality & syntax issues |

---

## 💡 Key Design Highlights

* **Offline-First Resilience**: All habits, tasks, completed sessions, and user settings persist across browser restarts using robust `localStorage` state reconciliation.
* **Fluid Feedback Loops**: Sound alerts and micro-interactions give satisfying dopamine boosts when completing tasks and study blocks.
* **Modern Aesthetic**: Harmonious color palettes, subtle glassmorphism cards, modern Inter typography, and adaptive dark mode tailored for late-night sessions.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Crafted with ❤️ by [Mahima](https://github.com/mahik2007)

⭐ If you found this project helpful, please consider starring the repository!

</div>

# FocusFlow

**A React + TypeScript productivity dashboard built to showcase interactive front-end development, maintainable UI architecture, and state management.**

[**Live Demo**](https://focusflow-pearl-beta.vercel.app/) · [**Source Code**](https://github.com/Matin-Pezham/focusflow)

## Overview

FocusFlow is a portfolio project centered on a task-management dashboard. It demonstrates how I approach building a structured, interactive React application rather than a collection of static pages.

The focus is on reusable UI, predictable application state, and a responsive, product-oriented interface.

## Technical Highlights

- **React + TypeScript:** Component-based development with static type checking.
- **Zustand:** Lightweight state-management tooling.
- **React Router:** Routing infrastructure for application navigation.
- **dnd-kit:** Drag-and-drop tooling included in the project stack.
- **Recharts:** Charting library included for dashboard-style data visualizations.
- **Tailwind CSS:** Utility-first styling.
- **Vite:** Local development and production builds.

> This section describes the project's verified dependencies and architectural focus. For a walkthrough of implemented interactions, use the live demo.

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite |
| State management | Zustand |
| Navigation | React Router |
| Drag-and-drop library | dnd-kit |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |

## Getting Started

**Prerequisites:** A supported Node.js version and npm.

```bash
git clone https://github.com/Matin-Pezham/focusflow.git
cd focusflow
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Available Commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
```

**Testing status:** The current `package.json` does not define a dedicated automated test command. A focused regression-test suite is a planned quality improvement; no test coverage is claimed here.

## Engineering Approach

My workflow combines independent engineering judgment with AI-assisted analysis where appropriate:

1. Understand the expected behavior and reproduce an issue.
2. Inspect the relevant components, state flow, and dependencies.
3. Use AI tools to accelerate investigation or generate candidate changes.
4. Review the proposed patch and preserve the existing architecture.
5. Run available checks and manually verify affected user flows.

**AI assists the workflow; architecture decisions, code review, and final validation remain my responsibility.**

## Next Improvements

- Document representative user flows with screenshots or a short walkthrough.
- Add automated tests for critical task-management interactions.
- Audit accessibility, keyboard navigation, and responsive edge cases.
- Record small bug fixes as reproducible, tested changes.

## Project Scope

FocusFlow is a portfolio demonstration of front-end development. The public demo is not presented as a commissioned client project or evidence of commercial production usage.

## Developer

**Matin Pezham** — React Developer | AI-Augmented Front-End Engineering

[GitHub Profile](https://github.com/Matin-Pezham)

# Hi-Lite Studio System Overview

**Hi-Lite Studio** is a studio web application, developed to manage the studio’s creative portfolio, client bookings, and internal administration. It provides a smooth and efficient experience for both clients and administrators, while prioritizing security and responsiveness.

### [Visit Live Site](https://hi-lite-studio.vercel.app/)

---

## System Purpose

- **Showcase Portfolio:** Display projects, artworks, and services professionally.
- **Manage Bookings:** Allow clients to schedule appointments through an easy-to-use online form.
- **Admin Management:** Enable studio staff to manage content, monitor bookings, and track studio activity through a secure dashboard.
- **Enhanced Interaction:** Provide a chatbot to assist clients with common questions and navigation.

---

## Key Features

### Client-Facing:
- Browse creative works and portfolio items.
- Submit booking requests online.
- Access a responsive, mobile-friendly interface.
- Interact with a chatbot for guidance.

### Admin-Facing:
- Secure login for studio staff.
- Dashboard to manage bookings and portfolio content.
- Monitor activity and view system data.
- Add, update, or remove portfolio items and client bookings.

---

## System Architecture

|        Layer        |                   Technology                   |
|---------------------|------------------------------------------------|
| Frontend            | React + TypeScript (Vite)                      |
| Backend & Database  | Supabase (authentication, database, storage))  |
| Deployment          | Vercel                                         |
| Styling & UI        | TailwindCSS with shadcn/ui components          |
| Chatbot Integration | OpenAI API for client assistance               |

---

## Security & Performance

- HTTPS via Vercel deployment ensures secure communication.
- Regular dependency and security scanning using npm audit and basic OWASP checks.
- Performance monitored using synthetic load testing tools (k6/Locust) to ensure fast loading and stable operations.

---

## Usage Workflow

1. Clients visit the website to view the portfolio or submit a booking request.
2. Admin users log in via the secure admin page to manage bookings and content.
3. The system tracks activity and maintains data consistency, allowing the studio to operate efficiently and securely.

---

## Project Team
| Name   | Role | GitHub |
|--------|------|--------|
|  Heart Chiong  |  Project Manager  | [@Aarchie14](https://github.com/Aarchie14) |
|  Mark Vincent Limpahan  |  UI/UX Designer  | [@markvncent](https://github.com/markvncent) |
|  Roxanne Locsin  |  Frontend Developer  | [@punyeeta](https://github.com/punyeeta) |
|  Gil John Rey Naldoza  |  System Architect & QA  | [@GilNaldoza](https://github.com/GilNaldoza) |
|  Rhenel Jhon Sajol  |  Backend Developer  | [@Tetsuuya](https://github.com/Tetsuuya) |
|  Angel Janette Taglucop  |  System Architect & QA  | [@angel-jane](https://github.com/angel-jane) |

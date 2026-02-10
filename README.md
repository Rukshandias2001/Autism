# Autism Project 🚀

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
   - [Backend](#backend)
   - [Frontend](#frontend)
6. [Environment Variables](#environment-variables)
7. [Useful Scripts](#useful-scripts)
8. [Project Structure](#project-structure)
9. [Sample Credentials](#Sample-Credentials)
11. [License & Contact](#license--contact)

---

## Overview
A web application built to assist mentors/parents working with children (Autism support tools). The project includes a full-stack application: an Express + MongoDB backend and a React + Vite frontend.

## Features ✨
- User roles: Mentor, Parent, Child
- Activity and routine management for children
- Game and content modules tailored for learning
- Speech therapy content management
- Reporting and session attempts tracking

## Tech Stack 🔧
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite
- Dev tools: nodemon, dotenv

## Prerequisites ✅
- Node.js 20+ and npm
- MongoDB running locally or a MongoDB Atlas connection

## Quick Start
Follow these steps to run the project locally.

### Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` file in `backend/` (see Environment Variables below).
3. Run in development mode:
   ```bash
   npm run dev
   ```
4. Production:
   ```bash
   npm start
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables (backend/.env) 🧾
Create `backend/.env` with the following values (examples):

- MONGO_URI= mongodb_database_link
- CLIENT_ORIGIN=http://localhost:5173
- PORT=3000

> Tip: Keep any sensitive values (API keys, secrets) out of version control.

## Useful Scripts (from `backend/package.json`) 📜
- `npm run dev` - start backend with `nodemon` for development
- `npm start` - start backend for production

(Frontend scripts live in `frontend/package.json`, e.g. `npm run dev`, `npm run build`.)

## Project Structure (high level) 📁
- `backend/` - Express server, routes, controllers, models, config
  - `controllers/` - route handlers
  - `models/` - Mongoose models
  - `routes/` - express routes
  - `config/` - db, cloudinary, multer
- `frontend/` - React app (Vite)

## Sample Credentials (dev) 🔐
- Mentor: `mentor@example.com` / `Pass123`
- Parent: `parent@example.com` / `password123`
- Child: `sample_child` / `123456`

## License & Contact 📬
- Licensed under the MIT License.

Team members: Sachithra Pinnaduwa, 
Kurukulasuriyage Dias,
Maddewithanage Umesha,
Omindu Semal Jayalath

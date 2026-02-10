# Autism Project

**Project Setup**
- **Prerequisites**: Node.js (v20+), npm, MongoDB (running).
- **Backend**:
	- **Install**: `cd backend` then `npm install`
	- **Environment**: create `backend/.env` with required variables (see below).
	- **Run (dev)**: `npm run dev` (uses `nodemon`)
	- **Run (prod)**: `npm start`
- **Frontend**:
	- **Install**: `cd frontend` then `npm install`
	- **Run (dev)**: `npm run dev` (Vite)

**Environment variables (backend/.env)**
- **MONGO_URI**: MongoDB connection string
- **CLIENT_ORIGIN** frontend url
- **PORT**: optional server port (default 3000 or as configured)

**Tech Stack**
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, JavaScript, CSS
- **Other**: `nodemon` for local dev, `dotenv` for env vars

**Team Members**
- Sachithra Pinnaduwa
- Kurukulasuriyage Dias
- Maddewithanage Umesha
- Omindu Semal Jayalath

**Sample Login Credentials**

- **Mentor**: uname: `mentor@example.com`, pwd: `Pass123`
- **Parent**: uname: `parent@example.com`, pwd: `password123`
- **Child**: uname: `sample_child`, pwd: `123456`
# MEAN Stack Application Setup Guide

Welcome to the MEAN Stack application repository! This application is separated into a Node.js/Express backend and an Angular 19 frontend. It uses MongoDB and MySQL as data stores and includes a robust suite of Jest testing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- [Angular CLI](https://v17.angular.io/cli) (`npm install -g @angular/cli`)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cluster URI)
- [MySQL](https://dev.mysql.com/downloads/installer/) (running locally)

---

## 🏗️ Backend Setup

The backend handles the RESTful API, database connections, and business logic. 

### 1. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `backend` directory based on the following template (which matches an assumed local development setup):

```env
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/my_database

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=my_database

# JWT Secret
JWT_SECRET=super_secret_jwt_key
```

> **Note:** Make sure your local MongoDB instance is running, and that you have a MySQL database created that matches `MYSQL_DATABASE`. Make sure to update the MySQL password to map your local engine's password.

### 3. Running the Server

**Development Mode (auto-reloads on file changes):**
```bash
npm run dev
```

**Production Mode (builds TypeScript and runs):**
```bash
npm run build
npm start
```

### 4. Running Backend Tests
The backend features a full Jest test suite mocking the database interactions:
```bash
npm run test
```

---

## 🎨 Frontend Setup

The frontend is an Angular 19 application featuring Tailwind CSS styling and state-managed pagination.

### 1. Installation
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

### 2. Environment Variables
Ensure the apiUrl target in `frontend/src/environments/environment.development.ts` points to your backend:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/',
};
```

### 3. Running the Development Server
Start the Angular frontend. It will automatically compile and open in your browser:
```bash
npm start
```
By default, the Angular app runs at `http://localhost:4200/`.

### 4. Running Frontend Tests
The frontend utilizes a customized Jest environment running Zoneless specifications:
```bash
npm run test
```

---

## 🛠️ Project Structure Overview
- `backend/src/controllers`: Request handlers for API endpoints.
- `backend/src/models`: Mongoose schemas.
- `backend/src/services`: Business logic and database calls.
- `frontend/src/app/features`: Main application views (e.g. Products, Orders, Users).
- `frontend/src/app/shared`: Reusable components (e.g. Pagination, Snackbar) and interfaces.
- `frontend/src/app/services`: Angular HTTP wrapper services interacting with the backend API.
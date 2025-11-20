# MERN Places App

A full-stack MERN application for creating, updating, and managing user-generated places.  
Built with **MongoDB, Express, React, and Node**, with validation, authentication UI, custom form handling, and geocoding.

This project is part of my professional portfolio and demonstrates full-stack development across both frontend and backend.

---

## 🚀 Features

### **Frontend (React + Vite)**

- Fully responsive UI
- Place creation & update forms with custom validation
- Modal, backdrop, card, drawer and map UI components
- Authentication UI (login/signup screens)
- Reusable input and form components (custom `useForm` + validators)
- Pages for:
  - Creating a place
  - Updating a place
  - Viewing a user’s places
- Global styling & clean component structure
- Vite-powered dev environment

### **Backend (Node + Express + MongoDB + Mongoose)**

- REST API for places and users:
  - `POST /api/places`
  - `GET /api/places/:pid`
  - `GET /api/places/user/:uid`
  - `PATCH /api/places/:pid`
  - `DELETE /api/places/:pid`
- User routes with validation hooks
- Centralized error handling middleware
- Request validation using `express-validator`
- Mongoose models:
  - `Place`
  - `User`
- MongoDB connection with proper error handling
- Geocoding utility to translate addresses into coordinates
- Clean folder structure for controllers, routes, middleware, validators, and models
- Protection against duplicate email registration (Mongo code **11000** handling)

---

## 🗂️ Project Structure

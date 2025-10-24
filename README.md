# Smart Event Management System

## 📝 Description

This project is a web application designed to streamline the process of managing events, from registration and attendance tracking using QR codes to certificate generation. It features separate interfaces for participants and administrators.

---

## ✨ Features

### Participant Features
* **User Authentication:** Secure signup and login for participants.
* **Event Browsing:** View a list of upcoming events.
* **Event Registration:** Register for events with a simple form (name, course, phone).
* **QR Code Generation:** Receive a unique QR code upon successful registration.
* **View Registrations:** See a list of events the user has registered for.
* **Download Certificate:** (Placeholder for future implementation).

### Admin Features
* **Secure Admin Login:** Separate login portal for administrators.
* **Dashboard:** View key statistics (total registrations, attendees, events).
* **Event Management:**
    * **Add Event:** Create new events with details like title, image, duration, venue, and team type.
    * **Delete Event:** Remove existing events.
* **Attendee Management:**
    * **QR Code Scanner:** Check-in attendees using their QR codes via device camera.
    * **View All Attendees:** See a searchable and sortable list of users who have checked in.
* **Certificate Management:**
    * **Generate Certificate:** Create downloadable certificate images for attendees of completed events.
    * **(Placeholder)** Upload Certificate Template.

---

## 💻 Tech Stack

* **Frontend:** React, React Router, `html5-qrcode` (scanner), `qrcode.react` / `qrcode-generator` / `qr-code-styling` (generator)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **File Uploads:** Multer

---

## 🚀 Getting Started

### Prerequisites
* Node.js and npm (or yarn) installed
* MongoDB installed locally or a connection string (e.g., from MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-project-folder>
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file in the backend folder
    # Add your MONGO_URI, PORT, and JWT_SECRET
    # Example .env:
    # PORT=5000
    # MONGO_URI=your_mongodb_connection_string
    # JWT_SECRET=your_super_secret_jwt_key

    # (Optional) Create the default admin user (if using seeder)
    # npm run data:import
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run server # (Uses nodemon for development)
    # Or: npm start (for production start)
    ```
    The backend should be running on `http://localhost:5000` (or your specified PORT).

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend should open in your browser, usually at `http://localhost:3000` or `http://localhost:5173`.

---

## 🛠️ Usage

* Access the participant portal via the main URL (`/`).
* Participants can sign up, log in, view events, and register.
* Admins log in via the dedicated `/admin/login` URL.
*admin email- harry@gmail.com
*admin pass- 12345678
* Admins can manage events, view attendees, and use the check-in scanner at `/admin/scanner`.

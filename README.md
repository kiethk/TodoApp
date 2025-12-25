# 📝 Advanced Task Management App (MERN Stack)

A robust Full-stack Todo Application featuring complete CRUD operations, Dark/Light theme switching, and a mobile-first responsive design. Built with the MERN stack (MongoDB, Express, React, Node.js) and deployed on cloud infrastructure.

![App Screenshot](screenshots/DemoImage.png)
## 🚀 Live Demo
👉 **Experience the app here:** [https://todo-app-five-ivory-53.vercel.app/](https://todo-app-five-ivory-53.vercel.app/)

---

## ✨ Key Features

* **Task Management:** Efficiently Create, Read, Update, and Delete (CRUD) tasks.
* **Theme Engine:** Seamless toggle between **Dark Mode** and **Light Mode** for better user experience.
* **Trash & Restore:** Soft-delete tasks to a "Trash" bin with options to restore or permanently delete them.
* **Mobile-First Design:** Fully responsive interface optimized for all devices (Mobile, Tablet, Desktop).
* **Real-time Synchronization:** Data is instantly synced with the Cloud MongoDB Database.

## 🛠 Tech Stack

### Frontend
* **ReactJS (Vite):** Fast and modern UI library.
* **SCSS / CSS Modules:** Modular and maintainable styling.
* **React Icons:** Comprehensive icon library.

### Backend
* **Node.js & Express:** Robust RESTful API architecture.
* **MongoDB & Mongoose:** NoSQL Database for flexible data storage.
* **CORS:** Secure cross-origin resource sharing.

### Deployment & DevOps
* **Frontend:** Hosted on **Vercel**.
* **Backend:** Hosted on **Render**.
* **Database:** **MongoDB Atlas** (Cloud).
* **Monitoring:** **UptimeRobot** (Ensures 24/7 availability).

---

## ⚙️ Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/kiethk/TodoApp.git
cd TodoApp
```
### 2. Backend Setup
* Navigate to the backend folder and install dependencies:
```bash
cd todo-backend
npm install
```
* Create a .env file in the backend directory with the following content:
```bash
MONGO_URI=mongodb+srv://todo_user:todo2025@todo-cluster.llhddj8.mongodb.net/?appName=todo-cluster
```
* Start the server:
```bash
node ./src/index.js
```
### 3. Frontend Setup
* Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd todo-frontend
npm install
```
* Create a .env file in the frontend directory:
```bash
VITE_API_URL=http://localhost:3000
```
* Start the application:
```bash
npm run dev
```
---
🤝 Contact
Created by Huynh Khac Kiet - Aspiring Web Developer.

📧 Email: kiethk.dt.vn@gmail.com

🔗 GitHub: github.com/kiethk

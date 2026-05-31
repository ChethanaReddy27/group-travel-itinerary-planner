# ✈️ Travel Planner - Group Itinerary Planning App

Travel Planner is a premium full-stack web application designed for group travelers to plan itineraries, vote on booking options, track expenses, chat, and keep up with travel tools collectively.

---

## 🚀 Key Features

### 🔒 User Authentication & Personalization
* **Registration & Login**: Secure credential checking using SHA-256 password hashing.
* **Customized Dashboard Loading**: Users only see and interact with group trips they are registered members of (maintaining compatibility with seeded test users `Alex`, `Jordan`, `Taylor`, and `Sam`).

### 🗺️ Collaborative Trip Dashboards
* **Itinerary Timeline**: Add, review, or delete travel options (Flights, Hotels, Trains, Buses) directly in a group timeline.
* **Consensus Voting**: An interactive upvote/downvote board allowing group members to reach a consensus on flights and hotels.
* **Expense Splitter**: Log expenditures, select participants, and see automated settlement balances showing who owes whom.
* **Real-time Group Chat**: Share planning suggestions directly inside the trip dashboard.

### 🧳 Interactive Travel Utilities
* **Pro Flight Tracker**: Lookup live flight status details (e.g. Flight `6E-6015`).
* **Visa Assistance**: Real-time checklist, processing duration, and fees for UAE, Schengen, Thailand, Singapore, and USA.
* **Fare Alerts**: Pin notification targets when fares drop below threshold pricing.
* **AI Chat Bot & FAQ**: Get immediate answers on voting, split bills, and booking procedures.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Vite, TypeScript, Lucide Icons, Vanilla CSS (Premium responsive custom theme).
* **Backend**: Node.js, Express, TypeScript, UUID.
* **Database**: MongoDB Atlas (with automatic fallback to local JSON database for easy offline development).

---

## 💻 Local Setup & Development

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas) (optional, falls back to `db.json` if omitted)

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChethanaReddy27/group-travel-itinerary-planner.git
   cd group-travel-itinerary-planner
   ```

2. **Configure Environment Variables**:
   Create a `.env` file inside the `server` directory:
   ```env
   MONGODB_URI=your-mongodb-atlas-connection-string
   PORT=3019
   ```

3. **Install Dependencies and Run**:
   From the root folder, run:
   ```bash
   # Install all packages and build client static assets
   npm run build

   # Start the application
   npm start
   ```
   Open your browser to **`http://localhost:3019`** to access the application!

---

## ☁️ Production Deployment on Render

This project contains a `render.yaml` configuration in its root for seamless, single-service deployment. 

1. Go to **[dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**.
2. Select your repository: `group-travel-itinerary-planner`.
3. Set the **`MONGODB_URI`** environment variable to your MongoDB Atlas connection string.
4. Click **Apply**.

Render will compile the frontend, serve it via the backend Express server, and host the entire application under a single deployed link (e.g., `https://travel-planner-app.onrender.com`).

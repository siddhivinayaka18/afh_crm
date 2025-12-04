# CRM Application

A full-stack Customer Relationship Management (CRM) system built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 **User Authentication** - Secure login/registration with JWT
- 👥 **User Management** - Admin can manage users and assign roles
- 📊 **Dashboard** - Overview of leads, customers, and sales metrics
- 🎯 **Lead Management** - Track and convert leads to customers
- 👤 **Customer Management** - Manage customer information and interactions
- 🎨 **Modern UI** - Clean, professional interface with Material-UI
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Material-UI (MUI)
- Axios
- Notistack (notifications)
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd crm
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables**

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Seed the database (optional)**
```bash
cd backend
npm run seed
```

This creates demo accounts:
- **Admin**: admin@crm.com / admin123
- **Sales Agent**: demo@crm.com / password123

5. **Run the application**

```bash
# Backend (from backend folder)
npm run dev

# Frontend (from frontend folder)
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Deployment

### Deploy to Render

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Create Web Service on Render**
- Go to [render.com](https://render.com)
- New Web Service → Connect GitHub repo
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`

3. **Add Environment Variables**
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your secret key
- `NODE_ENV` - `production`

4. **Deploy!** 🚀

## Project Structure

```
crm/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── server.js         # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # React entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead
- `GET /api/leads/:id` - Get lead by ID
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user role
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## License

MIT

## Author

Siddhi Vinayaka Raghumanda

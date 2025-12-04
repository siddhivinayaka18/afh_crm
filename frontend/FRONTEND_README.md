# CRM Frontend

A modern, full-featured CRM (Customer Relationship Management) system built with React and Material UI.

## 🚀 Features

- **Authentication**: JWT-based login and registration
- **Dashboard**: Real-time stats and analytics
- **Leads Management**: Full CRUD operations with status tracking
- **Customers Management**: Complete customer data management
- **Notes System**: Add notes to leads for better tracking
- **Protected Routes**: Secure pages with authentication guards
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **React 18**: Modern UI library
- **Material UI (MUI)**: Comprehensive component library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Vite**: Fast build tool and dev server

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your backend API URL
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosClient.js          # Axios configuration with interceptors
│   ├── components/
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Sidebar.jsx             # Side navigation menu
│   │   └── ProtectedRoute.jsx      # Route guard component
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Leads.jsx               # Leads list
│   │   ├── LeadAdd.jsx             # Add new lead
│   │   ├── LeadEdit.jsx            # Edit lead
│   │   ├── LeadDetails.jsx         # Lead details with notes
│   │   ├── Customers.jsx           # Customers list
│   │   ├── CustomerAdd.jsx         # Add new customer
│   │   ├── CustomerEdit.jsx        # Edit customer
│   │   └── CustomerDetails.jsx     # Customer details
│   ├── App.jsx                     # Main app component with routes
│   └── main.jsx                    # Entry point with theme provider
├── .env                            # Environment variables
├── .env.example                    # Example environment variables
├── package.json                    # Dependencies and scripts
└── vite.config.js                  # Vite configuration
```

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is received and stored in localStorage
3. Axios interceptor automatically attaches token to all API requests
4. Protected routes check for token before rendering
5. On 401 error, user is redirected to login

## 📊 Available Pages

| Route | Description |
|-------|-------------|
| `/login` | User login page |
| `/register` | User registration page |
| `/dashboard` | Main dashboard with statistics |
| `/leads` | List all leads |
| `/leads/add` | Add new lead |
| `/leads/edit/:id` | Edit existing lead |
| `/leads/:id` | View lead details and notes |
| `/customers` | List all customers |
| `/customers/add` | Add new customer |
| `/customers/edit/:id` | Edit existing customer |
| `/customers/:id` | View customer details |

## 🎨 Material UI Theme

The app uses a custom MUI theme configured in `main.jsx`:
- Primary color: Blue (#1976d2)
- Secondary color: Pink (#dc004e)

You can customize the theme by editing the theme object in `main.jsx`.

## 📦 Dependencies

Main dependencies:
- `react` & `react-dom`: UI framework
- `@mui/material`: Material UI components
- `@emotion/react` & `@emotion/styled`: Styling solution for MUI
- `@mui/icons-material`: Material UI icons
- `react-router-dom`: Routing
- `axios`: HTTP client

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your production backend URL

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify via:
   - Netlify CLI
   - Netlify web interface (drag & drop)
   - Connect to GitHub repository

3. Set environment variable `VITE_API_URL` in Netlify dashboard

## 🔧 Configuration

### Axios Configuration

The `axiosClient.js` includes:
- Base URL configuration from environment variables
- Request interceptor to attach JWT token
- Response interceptor for error handling (auto-logout on 401)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend server is running
- Check CORS configuration on backend
- Verify `VITE_API_URL` is correct in `.env`

### Authentication Issues
- Clear localStorage and try logging in again
- Check browser console for token-related errors
- Verify JWT token format from backend

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 Sample Test Account

After backend is set up with seed data, you can use:
- Email: `test@example.com`
- Password: `password123`

(Note: This will be provided once backend is complete)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review existing GitHub issues
- Create a new issue with detailed description

---

**Made with ❤️ using React and Material UI**

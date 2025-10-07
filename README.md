# SmartBlood - Blood Donation Management System

A comprehensive blood donation platform connecting donors with seekers through an intelligent matching system.

## 🩸 Overview

SmartBlood is a full-stack web application that facilitates blood donation by connecting donors with people in need. The system includes donor registration, blood request management, intelligent matching algorithms, and admin dashboard for system management.

## Architecture

- **Backend**: Flask (Python) with PostgreSQL database
- **Frontend**: React 19 with Vite build system
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication
- **API**: RESTful API design

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartBlood
   ```

2. **Setup Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Database**
   ```bash
   # Copy environment template
   cp env.template .env
   
   # Edit .env with your PostgreSQL credentials:
   # DATABASE_URL=postgresql+psycopg2://postgres:123@localhost:5432/smartblood
   # JWT_SECRET_KEY=your-secret-key
   # ADMIN_EMAIL=smartblooda@gmail.com
   # ADMIN_PASSWORD=Admin@123
   ```

4. **Initialize Database**
   ```bash
   python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
   ```

5. **Start Backend Server**
   ```bash
   python run.py
   ```
   Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
smartBlood/
├── backend/                 # Flask backend application
│   ├── app/
│   │   ├── admin/          # Admin routes and functionality
│   │   ├── auth/           # Authentication routes
│   │   ├── donor/          # Donor management routes
│   │   ├── requests/       # Blood request routes
│   │   ├── api/            # API endpoints
│   │   ├── config/         # Configuration files
│   │   ├── services/       # Business logic services
│   │   ├── models.py       # Database models
│   │   └── extensions.py   # Flask extensions
│   ├── migrations/         # Database migrations
│   ├── requirements.txt    # Python dependencies
│   ├── env.template        # Environment variables template
│   └── run.py             # Application entry point
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── styles/         # CSS stylesheets
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## 🔧 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication
- **Donor Management**: Registration, profile management, availability tracking
- **Blood Requests**: Create and manage blood donation requests
- **Smart Matching**: Intelligent donor-request matching algorithm
- **Admin Dashboard**: System administration and monitoring
- **Real-time Updates**: Live notifications and status updates

### User Roles
- **Donors**: Register, manage profile, respond to requests
- **Seekers**: Create blood requests, track matches
- **Admin**: System management, user oversight, analytics

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `donors` - Donor profiles and blood group information
- `requests` - Blood donation requests
- `match_records` - Donor-request matching data
- `donation_history` - Historical donation records
- `otp_sessions` - OTP verification sessions
- `refresh_tokens` - JWT refresh token management
- `admin_audit_logs` - Admin action logging

## Authentication

The system uses JWT tokens for authentication:
- Access tokens (15 minutes expiry)
- Refresh tokens (14 days expiry)
- Secure password hashing with bcrypt
- OTP verification for account setup

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Donor Management
- `GET /donor/profile` - Get donor profile
- `PUT /donor/profile` - Update donor profile
- `POST /donor/availability` - Update availability status

### Blood Requests
- `POST /requests/create` - Create blood request
- `GET /requests` - List requests
- `PUT /requests/{id}` - Update request status

### Admin
- `GET /admin/users` - List all users
- `GET /admin/requests` - List all requests
- `POST /admin/match` - Create donor matches

## Deployment

### Backend Deployment
1. Set production environment variables
2. Configure PostgreSQL database
3. Run database migrations
4. Deploy with WSGI server (Gunicorn)
5. Configure reverse proxy (Nginx)

### Frontend Deployment
1. Build production assets: `npm run build`
2. Serve static files from `dist/` directory
3. Configure API URL for production
4. Set up CDN for optimal performance

## 🔧 Configuration

### Backend Environment Variables
```bash
DATABASE_URL=postgresql+psycopg2://user:pass@host:port/dbname
JWT_SECRET_KEY=your-jwt-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
FLASK_ENV=production
```

### Frontend Environment Variables
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SmartBlood
VITE_DEBUG=false
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: smartblooda@gmail.com

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added admin dashboard
- **v1.2.0** - Enhanced matching algorithm
- **v1.3.0** - PostgreSQL migration and optimization

---

**SmartBlood** - Connecting lives through blood donation 🩸

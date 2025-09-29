# SmartBlood Frontend

React-based frontend application for the SmartBlood blood donation platform.

## Features

- **Modern React**: Built with React 19 and modern hooks
- **Responsive Design**: Mobile-first responsive design
- **Authentication**: JWT-based authentication with context API
- **Route Protection**: Protected routes for authenticated users
- **API Integration**: Comprehensive API service layer
- **Component Library**: Reusable UI components

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- SmartBlood backend running

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # CSS styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── env.example          # Environment template
└── vite.config.js       # Vite configuration
```

## Pages

### Public Pages
- **Home** (`/`) - Landing page with information about blood donation
- **Donor Login** (`/donor/login`) - Donor authentication
- **Donor Register** (`/donor/register`) - Donor registration
- **Admin Login** (`/admin/login`) - Admin authentication

### Protected Pages
- **Donor Dashboard** (`/donor/dashboard`) - Donor profile and statistics
- **Edit Profile** (`/donor/edit`) - Update donor information
- **Change Password** (`/donor/change-password`) - Password management
- **Blood Request** (`/seeker/request`) - Create blood donation requests

## Components

### Core Components
- **Nav** - Navigation bar with authentication state
- **ProtectedRoute** - Route protection wrapper
- **Banner** - Hero banner component
- **BannerSlider** - Image carousel

### Contexts
- **AuthContext** - Global authentication state management

### Hooks
- **useAuth** - Authentication state and methods
- **useApi** - API request handling with loading states

## Services

### API Services
- **api.js** - Axios configuration with interceptors
- **authService.js** - Authentication API calls
- **donorService.js** - Donor management API calls
- **requestService.js** - Blood request API calls

## Styling

The application uses CSS modules organized by feature:
- `global.css` - Global styles and CSS variables
- `nav.css` - Navigation component styles
- `home.css` - Home page styles
- `donor.css` - Donor-related page styles
- `admin.css` - Admin page styles
- `seeker.css` - Seeker page styles

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_APP_NAME` | Application name | `SmartBlood` |
| `VITE_DEBUG` | Debug mode | `true` |

## Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Nav.jsx` if needed
4. Create styles in `src/styles/`

### Adding New Services
1. Create service file in `src/services/`
2. Import and use in components
3. Add error handling and loading states

### Authentication Flow
1. User logs in via `authService.login()`
2. Token stored in localStorage
3. AuthContext provides global auth state
4. ProtectedRoute checks authentication
5. API requests include Authorization header

## Production Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Serve static files from `dist/` directory
4. Configure reverse proxy for API calls
5. Set up proper caching headers

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow React best practices
2. Use functional components and hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Write clean, readable code
6. Test components thoroughly
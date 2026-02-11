# RideReady Frontend

React-based frontend for the RideReady vehicle rental platform.

## Tech Stack

- **React 18.3.1**: UI library
- **Redux Toolkit**: State management
- **React Router v6**: Routing
- **Bootstrap 5 / Reactstrap**: UI components
- **Axios**: HTTP client
- **Formik**: Form handling
- **React Hot Toast**: Notifications

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── Auth/        # Authentication
│   │   ├── Book/        # Booking management
│   │   ├── Category/    # Vehicle categories
│   │   ├── Footer/      # Footer component
│   │   ├── Header/      # Header/navbar
│   │   ├── Home/        # Home page
│   │   ├── Loading/     # Loading states
│   │   ├── Notification/# Toast notifications
│   │   ├── Store/       # Vehicle listing
│   │   └── Vehicle/     # Vehicle management
│   ├── redux/           # Redux store
│   │   ├── store.js
│   │   ├── reducers.js
│   │   ├── actions.js
│   │   └── baseUrls.js
│   ├── App.js           # Main app component
│   ├── App.css          # Global styles
│   └── index.js         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see [backend/RideReady/README.md](../backend/RideReady/README.md))

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:9000
```

For production:
```env
REACT_APP_BACKEND_URL=http://your-backend-ip:9000
```

### Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

Creates optimized build in `build/` directory.

### Testing

```bash
npm test
```

## Features

### User Features
- 🔐 Authentication (JWT-based)
- 🚗 Browse vehicles by category
- 📅 Book vehicles
- 📋 View booking history
- 👤 User profile management

### Admin Features
- ➕ Add/Edit/Delete vehicles
- 📊 Manage categories
- 📋 View all bookings
- 🚗 Vehicle inventory management

## API Integration

The frontend communicates with the Django backend API:

- **Base URL**: `REACT_APP_BACKEND_URL` environment variable
- **Authentication**: JWT tokens stored in Redux persist
- **Endpoints**: Defined in `src/redux/baseUrls.js`

## Redux Store Structure

```javascript
{
  auth: {
    isAuthenticated: boolean,
    user: object,
    token: string
  },
  vehicles: array,
  categories: array,
  bookings: array,
  // ... other slices
}
```

## Deployment

### Option 1: S3 Static Website (Current Setup)

```bash
# From project root
./deploy-frontend.sh
```

### Option 2: Manual Deployment

```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
```

### Option 3: GitHub Actions

Automatically deploys on push to `main` branch. See [../.github/workflows/deploy-frontend.yml](../.github/workflows/deploy-frontend.yml)

## Environment-Specific Builds

### Development
```bash
npm start
```

### Staging
```bash
REACT_APP_BACKEND_URL=https://staging-api.example.com npm run build
```

### Production
```bash
REACT_APP_BACKEND_URL=https://api.example.com npm run build
```

## Troubleshooting

### CORS Errors
Ensure backend `.env` has correct `CORS_ALLOWED_ORIGINS`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://your-s3-url
```

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
1. Check `REACT_APP_BACKEND_URL` in `.env`
2. Verify backend is running
3. Check browser console for errors
4. Verify network tab for API calls

## Contributing

1. Make changes in `frontend/` directory
2. Test locally with `npm start`
3. Build with `npm run build`
4. Commit and push

## Scripts

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from CRA (irreversible)

## License

Part of the RideReady project.

# Pharmacy Delivery App

A full-stack web application for ordering medicines online with prescription management and delivery scheduling.

## Features

- User authentication and authorization
- Medicine catalog with search and filtering
- Shopping cart functionality
- Prescription upload and management
- Order tracking and history
- Admin dashboard for medicine and order management
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pharmacy-delivery.git
cd pharmacy-delivery
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pharmacy_delivery
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

Create `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Deployment

### Using Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

## API Documentation

### Authentication

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Medicines

#### GET /api/medicines
Get all medicines with optional query parameters:
- search: Search by name
- category: Filter by category
- sort: Sort by price (asc/desc)

#### GET /api/medicines/:id
Get medicine details by ID

### Orders

#### POST /api/orders
Create new order
```json
{
  "items": [
    {
      "medicineId": "123",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### GET /api/orders/user
Get user's orders

### Prescriptions

#### POST /api/prescriptions/upload
Upload prescription file (multipart/form-data)
- prescription: File (PDF, JPEG, PNG)

#### GET /api/prescriptions
Get user's prescriptions

## Project Structure

```
pharmacy-delivery/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── package.json
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@pharmacydelivery.com or create an issue in the repository. 
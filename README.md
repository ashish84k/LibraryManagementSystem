# Library Management System

A full-stack library management system built with React (Frontend) and Node.js with Sequelize ORM (Backend).

## Features

### User Features
- User registration and login
- Browse available books
- Borrow books
- Return books
- View borrowed books

### Admin Features
- Add new books
- Update book information
- Delete books
- Manage book inventory

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
LibraryManagementSystem/
├── Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route components
│   │   └── lib/             # Utility functions
│   └── package.json
├── Backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Main server file
│   ├── Procfile             # For deployment
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Books
- `GET /book` - Get all books
- `POST /book` - Add new book (Admin only)
- `PUT /book/:id` - Update book (Admin only)
- `DELETE /book/:id` - Delete book (Admin only)

### Borrowing
- `POST /borrow` - Borrow a book
- `POST /borrow/return` - Return a book
- `GET /borrow/my-borrows` - Get user's borrowed books

## Installation & Setup

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
MYSQLHOST=your_mysql_host
MYSQLPORT=3306
MYSQLUSER=your_mysql_user
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=your_mysql_database
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Deployment

The project is configured for easy deployment on platforms like:
- Railway
- Heroku
- Render
- Vercel

See `Backend/DEPLOYMENT.md` for detailed deployment instructions.

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (User/Admin)
- createdAt
- updatedAt

### Books Table
- id (Primary Key)
- title
- author
- genre
- totalCopies
- borrowed
- createdAt
- updatedAt

### Borrows Table
- id (Primary Key)
- userId (Foreign Key)
- bookId (Foreign Key)
- borrowDate
- returnDate
- createdAt
- updatedAt

## Features Implemented

- ✅ User Authentication (JWT)
- ✅ Role-based Access Control
- ✅ Book Management (CRUD)
- ✅ Borrow/Return System
- ✅ Transaction Management
- ✅ Data Validation
- ✅ Error Handling
- ✅ Responsive UI
- ✅ Production Ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

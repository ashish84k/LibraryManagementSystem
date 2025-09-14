# Deployment Guide

## Environment Variables Required

Set these environment variables in your hosting platform:

```bash
# Database Configuration
MYSQLHOST=your_mysql_host
MYSQLPORT=3306
MYSQLUSER=your_mysql_user
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=your_mysql_database

# JWT Secret
JWT_SECRET=your_strong_jwt_secret_key

# Server Port (usually auto-set by hosting platform)
PORT=5000

# Environment
NODE_ENV=production
```

## Supported Platforms

### 1. Railway
- Connect your GitHub repository
- Set environment variables in Railway dashboard
- Deploy automatically

### 2. Heroku
- Connect GitHub repository
- Add MySQL addon (JawsDB or ClearDB)
- Set environment variables in Heroku dashboard

### 3. Render
- Connect GitHub repository
- Add MySQL database
- Set environment variables

### 4. Vercel
- Connect GitHub repository
- Set environment variables
- Deploy

## Database Setup

The application will automatically:
- ✅ Connect to your MySQL database
- ✅ Create tables if they don't exist
- ✅ Handle foreign key constraints
- ✅ Set up proper relationships

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

## Testing

After deployment, test these endpoints:

1. **Register a user**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **Get books**: `GET /book`
4. **Borrow a book**: `POST /borrow`
5. **Get my borrows**: `GET /borrow/my-borrows`
6. **Return a book**: `POST /borrow/return`

## Troubleshooting

### Database Connection Issues
- Check environment variables are set correctly
- Verify database credentials
- Ensure database server is accessible

### Table Creation Issues
- Check database permissions
- Verify MySQL version compatibility
- Check console logs for specific errors

### CORS Issues
- CORS is enabled for all origins
- For production, consider restricting to specific domains

## Production Checklist

- ✅ Environment variables set
- ✅ Database connected
- ✅ Tables created
- ✅ CORS configured
- ✅ Error handling in place
- ✅ Logging configured
- ✅ Port binding to 0.0.0.0

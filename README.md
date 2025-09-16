# Movies API Backend

A complete Node.js backend application for movie management with user authentication, built using Express.js, MongoDB, and Mongoose following MVC architecture.

## Features

### Authentication & User Management
- User registration and login with JWT authentication
- Password hashing with bcrypt
- User profile management
- Role-based access control (User/Admin)
- Password change functionality
- User management for admins

### Movie Management
- Complete CRUD operations for movies
- Advanced search and filtering
- Pagination support
- Movies by genre
- Top-rated movies
- Latest movies
- Movie statistics (Admin only)
- Rich movie data including cast, awards, budget, box office

### Security & Performance
- JWT token authentication
- Rate limiting
- Input validation
- Error handling
- CORS support
- Security headers with Helmet
- Request logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: morgan
- **Environment**: dotenv

## Project Structure

```
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── movieController.js   # Movie CRUD logic
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Input validation rules
├── models/
│   ├── User.js              # User schema
│   └── Movie.js             # Movie schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── movies.js            # Movie routes
├── utils/
│   └── seedData.js          # Database seeding utility
├── app.js                   # Express app configuration
├── server.js                # Server entry point
└── package.json             # Dependencies
```

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd movies-api-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/movies_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Seed Database (Optional)**
```bash
# Import sample data
node utils/seedData.js -i

# Delete all data
node utils/seedData.js -d
```

6. **Start the server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user",
  "phone": "+1234567890",
  "bio": "Movie enthusiast"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Updated bio"
}
```

#### Change Password
```http
PUT /api/auth/changepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

### Movie Endpoints

#### Get All Movies
```http
GET /api/movies?page=1&limit=10&sort=-rating&search=batman&genre=Action
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (prefix with - for descending)
- `search`: Search in title, description, director
- `genre`: Filter by genre
- `rating[gte]`: Minimum rating
- `releaseDate[gte]`: Movies after date

#### Get Single Movie
```http
GET /api/movies/:id
```

#### Create Movie (Authentication Required)
```http
POST /api/movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Matrix",
  "description": "A computer programmer discovers reality isn't what it seems.",
  "genre": ["Action", "Sci-Fi"],
  "director": "The Wachowskis",
  "cast": [
    {"name": "Keanu Reeves", "role": "Neo"},
    {"name": "Laurence Fishburne", "role": "Morpheus"}
  ],
  "rating": 8.7,
  "duration": 136,
  "releaseDate": "1999-03-31",
  "language": "English",
  "country": "USA",
  "posterUrl": "https://example.com/matrix-poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=example",
  "budget": 63000000,
  "boxOffice": 467222824
}
```

#### Update Movie (Authentication Required)
```http
PUT /api/movies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 9.0,
  "description": "Updated description"
}
```

#### Delete Movie (Authentication Required)
```http
DELETE /api/movies/:id
Authorization: Bearer <token>
```

#### Get Movies by Genre
```http
GET /api/movies/genre/Action?page=1&limit=10
```

#### Get Top Rated Movies
```http
GET /api/movies/top-rated?limit=10
```

#### Get Latest Movies
```http
GET /api/movies/latest?limit=10
```

#### Get Movie Statistics (Admin Only)
```http
GET /api/movies/admin/stats
Authorization: Bearer <admin_token>
```

## Movie Schema Fields

- **title**: Movie title (required, max 200 chars)
- **description**: Movie description (required, max 2000 chars)
- **genre**: Array of genres (required)
- **director**: Director name (required, max 100 chars)
- **cast**: Array of cast members with name and role
- **rating**: Movie rating 0-10 (required)
- **duration**: Duration in minutes (required)
- **releaseDate**: Release date (required)
- **language**: Movie language (required)
- **country**: Country of origin (required)
- **posterUrl**: Poster image URL (required)
- **trailerUrl**: Trailer video URL (optional)
- **budget**: Production budget (optional)
- **boxOffice**: Box office earnings (optional)
- **awards**: Array of awards (optional)
- **imdbId**: IMDB ID (optional, unique)
- **status**: active/inactive/coming-soon (default: active)

## User Schema Fields

- **name**: User's full name (required, max 50 chars)
- **email**: Email address (required, unique)
- **password**: Hashed password (required, min 6 chars)
- **role**: user/admin (default: user)
- **avatar**: Profile picture URL
- **phone**: Phone number
- **dateOfBirth**: Date of birth
- **bio**: User biography (max 500 chars)
- **isActive**: Account status (default: true)
- **lastLogin**: Last login timestamp

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Development

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Database Seeding

Use the seeding utility to populate your database with sample data:

```bash
# Import sample users and movies
node utils/seedData.js -i

# Clear all data
node utils/seedData.js -d
```

Sample accounts created:
- **Admin**: admin@example.com / admin123
- **User**: john@example.com / user123

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive validation rules
- **CORS**: Cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: Secure error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

# Task Manager Backend

Modern, scalable backend API for Task Manager application built with Node.js, Express.js, TypeScript, and MongoDB.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend integration

## 📁 Project Structure

```
src/
├── controllers/          # Route handlers
├── services/            # Business logic layer
├── repositories/        # Data access layer (future)
├── middleware/          # Custom middleware
├── schemas/            # Zod validation schemas
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── config/             # Configuration files
└── routes/             # API route definitions
```

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task

### Reports

- `GET /api/reports` - Get reports (future)

## 🔒 Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## ✅ Features

- ✅ TypeScript support
- ✅ Zod validation
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Error handling
- ✅ CORS enabled
- ✅ MongoDB integration
- ✅ Modern ES6+ syntax
- ✅ Clean architecture
- ✅ Type safety

## 🚧 Future Enhancements

- [ ] Prisma ORM integration
- [ ] Redis caching
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Docker support
- [ ] CI/CD pipeline

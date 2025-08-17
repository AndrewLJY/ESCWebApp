# Hotel Booking App

A full-stack hotel booking application with React frontend and Node.js backend.

## Project Structure

```
ESCWebApp/
├── backend/          # Node.js/Express API server
├── client/           # React frontend application
├── Dockerfile        # Monorepo Docker configuration
├── docker-compose.yml # Local development setup
├── render.yaml       # Render deployment configuration
└── package.json      # Root package.json for monorepo
```

## Local Development

### Prerequisites
- Node.js 18+
- MySQL database
- Docker (optional)

### Setup Database
```sql
CREATE DATABASE hotelbookingapp;
CREATE USER 'escHotelT5'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON hotelbookingapp.* TO 'escHotelT5'@'localhost';
FLUSH PRIVILEGES;
```

### Option 1: Run with Docker
```bash
# Build and run the application in detached mode
docker-compose up -d --build

# Stop the application
docker-compose down

# Access the application at http://localhost:3001
```

**Container Organization:**
- **app**: Single container running both frontend (nginx) and backend (Node.js)
- Uses host network mode to connect to local MySQL database
- Frontend served on port 80, backend API on port 8080

### Option 2: Run Locally
```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:8080
npm run dev:frontend # Frontend on http://localhost:5173
```

## API Endpoints

- `GET /search/*` - Hotel search endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/allBookmarks/:email` - Get user bookmarks
- `POST /auth/bookmarks` - Add bookmark
- `POST /auth/deleteBookmark` - Remove bookmark

## Frontend Routes

- `/` - Landing page
- `/search` - Hotel search results
- `/hotel/:id` - Hotel details
- `/bookmarks` - User bookmarks
- `/checkout` - Booking checkout

## Technologies Used

- **Frontend**: React, Vite, Bootstrap, React Router
- **Backend**: Node.js, Express, MySQL
- **Deployment**: Docker, Render
- **Testing**: Jest, React Testing Library

# (Come Fly with Me) Hotel Booking App for Ascenda 

A full-stack hotel booking application with React frontend and Node.js backend, featuring comprehensive testing with unit, integration and end-end testing using **NPM Jest** and **Cypress**, complete with containerisation using **Docker**.

## Project Structure

```
ESCWebApp/
├── backend/              # Node.js/Express API server
│   ├── testing/          # Backend unit & integration tests
│   ├── routes/           # API route handlers
│   ├── models/           # Database models
│   └── hotel_data/       # Hotel data services & DTOs
├── client/               # React frontend application
│   └── src/test/         # Frontend component tests
├── cypress/              # End-to-end test suites
│   └── e2e/              # Cypress E2E test specs
├── docker-compose.yml    # Docker containerization setup
├── render.yaml           # Render deployment configuration
└── package.json          # Root package.json for monorepo
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MySQL database
- Docker & Docker Compose (optional, for containerized deployment)

### Setup Database
```sql
CREATE DATABASE hotelbookingapp;
CREATE USER 'escHotelT5'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON hotelbookingapp.* TO 'escHotelT5'@'localhost';
FLUSH PRIVILEGES;
```

### Option 1: Run Locally
```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:8080
npm run dev:frontend # Frontend on http://localhost:5173
```

### Option 2: Run with Docker
See [Docker Containerization](#docker-containerization) section below.

---

## Testing

This project includes **600+ test cases** across unit tests, integration tests, and end-to-end tests.

### Unit & Integration Tests (Jest)

The project uses **Jest** as the primary testing framework for both backend and frontend testing.

#### Backend Tests
Located in `backend/testing/`, includes:
- **Unit Tests**: `unit_tests/` - Tests for individual components (DTOs, services, routers)
- **Integration Tests**: `integration_tests/` - API endpoint testing with database interactions

```bash
# Navigate to backend directory
cd backend

# Run all backend tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

**Backend Test Files:**
| Test File | Description |
|-----------|-------------|
| `hotel_data_DTO.test.js` | Hotel data transfer object tests |
| `hotel_data_service.test.js` | Hotel data service layer tests |
| `hotel_room_data_DTO.test.js` | Hotel room DTO tests |
| `hotel_room_data_service.test.js` | Hotel room service tests |
| `booking_router.test.js` | Booking API endpoint tests |
| `search_router.test.js` | Search functionality tests |
| `stripe.test.js` | Payment integration tests |
| `user_router.test.js` | User authentication tests |
| `server.test.js` | Integration tests |

#### Frontend Tests
Located in `client/src/test/`, uses **Jest** with **React Testing Library**.

```bash
# Navigate to client directory
cd client

# Run all frontend tests
npm test

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage
npm test -- --coverage
```

#### Run All Tests
```bash
# From root directory - run backend tests
cd backend && npm test

# From root directory - run frontend tests  
cd client && npm test
```

### End-to-End Tests (Cypress)

The project uses **Cypress** for comprehensive end-to-end testing of user workflows.

#### E2E Test Suites
Located in `cypress/e2e/`:

| Test Suite | Description |
|------------|-------------|
| `login.cy.js` | User login flow testing |
| `register.cy.js` | User registration testing |
| `search_dest.cy.js` | Destination search functionality |
| `search_hotel.cy.js` | Hotel search and results |
| `filter.cy.js` | Search filter functionality |
| `bookmark.cy.js` | Bookmark/favorites feature |
| `book_room.cy.js` | Room booking process |
| `payment.cy.js` | Payment flow with Stripe |

#### Running Cypress Tests

**Prerequisites:** Ensure both frontend and backend are running before executing Cypress tests.

```bash
# Start the application first (in separate terminals)
cd backend && npm start    # Terminal 1: Backend on port 8080
cd client && npm run dev   # Terminal 2: Frontend on port 5173

# Then run Cypress tests
```

**Interactive Mode (Cypress Test Runner):**
```bash
# From root directory
npx cypress open

# Or from client directory
cd client && npx cypress open
```

**Headless Mode (CI/CD):**
```bash
# Run all E2E tests headlessly
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run with specific browser
npx cypress run --browser chrome
```

---

## Docker Containerization

The application is fully containerized using Docker with a multi-container setup.

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Docker Network                        │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────┐         ┌────────────────────┐      |
│  │   hotel_client  │         │    hotel_backend   │      |
│  │   (Nginx)       │──────▶       (Nodejs)        \      \    
│  │   Port: 3001    │         │     Port: 8080      │      │
│  └─────────────────┘         └──────────┬──────────┘      │
│                                         │                 │
└─────────────────────────────────────────┼─────────────────┘
                                          │
                              ┌───────────▼──────────┐
                              │     MySQL Database   │
                              │     (Host Machine)   │
                              └──────────────────────┘
```

### Container Details

| Container | Image | Port | Description |
|-----------|-------|------|-------------|
| `hotel_client` | nginx:alpine | 3001:80 | Serves React frontend via Nginx |
| `hotel_backend` | node:18-alpine | 8080:8080 | Node.js/Express API server |

### Docker Commands

```bash
# Build and start all containers
docker-compose up -d --build

# View running containers
docker-compose ps

# View container logs
docker-compose logs -f              # All containers
docker-compose logs -f backend      # Backend only
docker-compose logs -f client       # Frontend only

# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild a specific service
docker-compose up -d --build backend
docker-compose up -d --build client
```

### Environment Variables

The backend container uses these environment variables (configured in `docker-compose.yml`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Environment mode |
| `DB_HOST` | host.docker.internal | Database host |
| `DB_USER` | escHotelT5 | Database user |
| `DB_PASSWORD` | 12345 | Database password |
| `DB_NAME` | hotelbookingapp | Database name |

### Building Individual Images

```bash
# Build backend image
docker build -t hotel-backend ./backend

# Build frontend image
docker build -t hotel-client ./client

# Run backend container standalone
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=escHotelT5 \
  -e DB_PASSWORD=12345 \
  -e DB_NAME=hotelbookingapp \
  --add-host=host.docker.internal:host-gateway \
  hotel-backend

# Run frontend container standalone
docker run -p 3001:80 hotel-client
```

### Accessing the Application

After running `docker-compose up -d --build`:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8080

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/search/*` | Hotel search endpoints |
| `POST` | `/auth/login` | User authentication |
| `POST` | `/auth/register` | User registration |
| `GET` | `/auth/allBookmarks/:email` | Get user bookmarks |
| `POST` | `/auth/bookmarks` | Add bookmark |
| `POST` | `/auth/deleteBookmark` | Remove bookmark |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/search` | Hotel search results |
| `/hotel/:id` | Hotel details |
| `/bookmarks` | User bookmarks |
| `/checkout` | Booking checkout |

---

## Technologies Used

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite, Bootstrap 5, React Router, Stripe.js |
| **Backend** | Node.js 18, Express 5, MySQL2, JWT, bcrypt |
| **Testing** | Jest, React Testing Library, Supertest, Cypress |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Deployment** | Render |

---

## Quick Reference

```bash
# Development
npm run install:all          # Install all dependencies
npm run dev                  # Run full stack in dev mode

# Testing
cd backend && npm test       # Run backend tests
cd client && npm test        # Run frontend tests
npx cypress open             # Open Cypress test runner
npx cypress run              # Run E2E tests headlessly

# Docker
docker-compose up -d --build # Build and start containers
docker-compose down          # Stop containers
docker-compose logs -f       # View logs
```

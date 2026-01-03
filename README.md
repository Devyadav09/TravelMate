# 🌍 TravelMate - Your All-in-One Travel Ecosystem

**Transform the way people travel, connect, and explore the world.**

## 🎯 What is TravelMate?

TravelMate is not just another travel app - it's a **complete travel ecosystem** that brings together ride-sharing, vehicle rentals, tour companions, and professional guides into one powerful backend platform. Built with enterprise-grade Node.js architecture, TravelMate empowers travelers to move, explore, and connect seamlessly.

### 💡 The Vision

Imagine a world where:
- 🚗 Finding a ride to your destination is as easy as a few taps
- 🚙 Renting a car is location-specific and hassle-free
- 👥 Connecting with fellow travelers for epic road trips is instant
- 🗺️ Discovering local tour guides happens in seconds

**TravelMate makes this vision a reality.**

---

## ✨ Features

### 🚘 **Module 1: Ride Sharing** 
*Inspired by BlaBlaCar - Carpooling Reimagined*

Connect drivers with empty seats to passengers heading the same direction. Save money, reduce carbon footprint, and make new friends on the road.

- 🎯 Smart ride matching algorithms
- 💰 Cost-effective carpooling
- 🔒 Verified driver and passenger profiles
- 📍 Real-time location-based searches

### 🚙 **Module 2: Vehicle Rental Marketplace**
*Peer-to-Peer Car Sharing*

A revolutionary platform connecting vehicle owners with renters. List your car, earn passive income, or find the perfect vehicle for your journey.

- 🏪 Location-specific vehicle discovery
- 💳 Integrated payment processing
- 📅 Flexible booking system
- 🔐 Secure owner-renter transactions

### 👥 **Module 3: Tour Companions**
*Find Your Travel Tribe*

Solo travel doesn't have to be lonely. Connect with like-minded adventurers, share experiences, and create unforgettable memories together.

- 🗺️ Create and join road trips (Point A → Point B)
- 👫 Group formation and management
- 🎒 Discover travel buddies with similar interests
- 🚀 Spontaneous adventure planning

### 🗺️ **Module 4: Tour Guide Services**
*Local Experts at Your Fingertips*

Connect with professional tour guides who know every hidden gem in their city. Authentic experiences, local insights, personalized tours.

- 📍 Location-based guide discovery
- ⭐ Guide profiles with expertise areas
- 🎓 Verified professional credentials
- 💼 Seamless booking system

---

## 🏗️ Architecture

### Built with Industry Standards

```
🎯 Clean Architecture  ✅ Modular Design  ✅ SOLID Principles
🔐 Role-Based Access Control  ✅ Middleware Pattern  ✅ Service Layer
```

### Technology Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Authentication** | JWT + Role-Based Access Control |
| **Architecture** | MVC + Service Layer Pattern |
| **Validation** | Custom Validation Middleware |
| **API Style** | RESTful API |

### Project Structure

```
📦 TravelMate
├── 📂 src
│   ├── 📂 modules
│   │   ├── 📂 auth
│   │   │   ├── 📄 controllers      # Request handlers
│   │   │   ├── 📄 models           # Data models
│   │   │   ├── 📄 routes           # Route definitions
│   │   │   └── 📄 services         # Business logic
│   │   ├── 📂 driver               # Ride sharing logic
│   │   ├── 📂 rental               # Vehicle rental logic
│   │   ├── 📂 ride                 # Ride management
│   │   └── 📂 users                # User management
│   ├── 📂 middleware               # Auth, validation, error handling
│   ├── 📂 db                       # Database configuration
│   ├── 📂 routes                   # Main route aggregator
│   ├── 📂 utils                    # Helper functions
│   └── 📂 validation               # Input validation schemas
├── 📄 package.json
└── 📄 README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **npm**
- **MongoDB**

### Installation

```bash
# Clone the repository
git clone https://github.com/Devyadav09/TravelMate.git
cd TravelMate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure your .env file
# PORT=3000
# DATABASE_URL=your_database_url
# JWT_SECRET=your_super_secret_key
# JWT_EXPIRE=24h
# NODE_ENV=development

# Run the application
npm run dev
```

**🎉 Server will be running on `http://localhost:3000`**

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/logout` | User logout | ✅ |

### Ride Sharing Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/rides` | Create ride offer | ✅ Driver |
| GET | `/api/rides` | Search rides | ✅ |
| POST | `/api/rides/:id/book` | Book a ride | ✅ User |
| GET | `/api/rides/my-rides` | Get user's rides | ✅ |

### Vehicle Rental Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/rentals` | List rental vehicle | ✅ Owner |
| GET | `/api/rentals` | Search rentals by location | ✅ |
| POST | `/api/rentals/:id/book` | Book rental | ✅ User |
| GET | `/api/rentals/owner` | Owner's vehicles | ✅ Owner |

### Tour Companions Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tours` | Create trip | ✅ User |
| GET | `/api/tours` | Search trips | ✅ |
| POST | `/api/tours/:id/join` | Join a trip | ✅ User |
| GET | `/api/tours/my-trips` | User's trips | ✅ |

### Tour Guide Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/guides/register` | Register as guide | ✅ |
| GET | `/api/guides` | Search by location | ✅ |
| GET | `/api/guides/:id` | Get guide profile | ✅ |
| POST | `/api/guides/:id/book` | Book tour guide | ✅ User |

### 🧪 Example cURL Requests

**Register a New User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "user"
  }'
```

**Create a Ride Offer:**
```bash
curl -X POST http://localhost:3000/api/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from": "New Delhi",
    "to": "Jaipur",
    "date": "2026-01-15",
    "seats": 3,
    "price": 500
  }'
```

**Search Tour Guides:**
```bash
curl -X GET "http://localhost:3000/api/guides?location=Goa" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Role-Based Access Control

TravelMate implements sophisticated RBAC for security and proper access management.

### Available Roles

| Role | Permissions |
|------|-------------|
| 👤 **User** | Book rides, rentals, join trips, hire guides |
| 🚗 **Driver** | Offer rides + all user permissions |
| 🏪 **Rental Owner** | List vehicles + all user permissions |
| 🗺️ **Tour Guide** | Offer guide services + all user permissions |
| 👑 **Admin** | Full system access *(coming soon)* |

### Middleware Protection

```javascript
// Example: Protected route with role checking
router.post('/rides', 
  authMiddleware,           // Verify JWT token
  roleMiddleware(['driver']), // Check user role
  createRide                // Controller function
);
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Role-based authentication system
- [x] Modular architecture
- [x] Core API endpoints for all 4 modules
- [x] Authorization middleware
- [x] Input validation
- [x] Error handling

### 🚀 Phase 2: Enhancement (Next)
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time ride tracking with WebSockets
- [ ] Rating and review system
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Image upload (vehicles, profiles)
- [ ] Advanced search filters

### 🌟 Phase 3: Advanced Features
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] AI-powered ride matching
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Social media integration
- [ ] Referral system
- [ ] Loyalty program

### 📖 Phase 4: Documentation & Testing
- [ ] Swagger/OpenAPI documentation
- [ ] Postman collection
- [ ] Unit tests
- [ ] Integration tests
- [ ] API rate limiting
- [ ] Performance optimization

---

## 🛠️ Development Guidelines

### Code Standards

- ✅ Follow modular structure (controllers, models, routes, services)
- ✅ Use middleware for authentication and validation
- ✅ Implement comprehensive error handling
- ✅ Write clean, self-documenting code
- ✅ Add comments for complex logic
- ✅ Follow RESTful API conventions



**Made with ❤️ and ☕ by Dev Yadav**

*"Travel is the only thing you buy that makes you richer."*

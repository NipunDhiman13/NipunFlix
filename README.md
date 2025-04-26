# NipunFlix

NipunFlix is a fullstack Netflix-inspired streaming platform built with Node.js, Express, MongoDB, and a modern frontend. It offers user authentication, content browsing, and a responsive, Netflix-like UI.

## Features

- 🔒 User authentication (JWT-based registration & login)
- 📧 Email verification and password reset
- 🎬 Browse and search for movies, TV shows, and anime
- 📝 User profiles and watch history
- ⭐ Add to favorites and track viewing progress
- 🏷️ Role-based access (admin/content-moderator/user)
- 📱 Responsive design for mobile and desktop
- 🚀 RESTful API with secure endpoints
- 🌐 CORS-enabled for frontend-backend integration

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript (Vanilla or your framework)
- **Authentication:** JWT (JSON Web Token)
- **Security:** Helmet, CORS, express-mongo-sanitize, rate limiting
- **Email:** Nodemailer (for verification and password reset)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

git clone https://github.com/NipunDhiman13/NipunFlix.git
cd NipunFlix

text

2. **Backend Setup:**

cd nipunflix-backend
npm install

text

3. **Environment Variables:**

Create a `.env` file in the backend root:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nipunflix
JWT_SECRET=your_very_secret_key_here_make_it_long_and_complex
CORS_ORIGIN=http://localhost:3000

text

4. **Start the backend server:**

npm start

text

5. **Frontend Setup:**

- Place your HTML, CSS, and JS files in the `public/` folder (or as appropriate).
- Serve the frontend using a simple HTTP server or open `website.html` with Live Server.

### API Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset
- `GET /api/v1/content` - Fetch all content
- `GET /api/v1/users/me` - Get current user profile
- ...and more!

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


## Contact

- [Nipun Dhiman](https://github.com/NipunDhiman13)

---

**Enjoy streaming with NipunFlix!**

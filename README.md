# SecureMint - Secure Authentication Platform

SecureMint is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application engineered for secure and user-friendly authentication. It offers robust user management—including signup, login, and OTP-based password resets—protected by JWT authentication and built atop a reliable MongoDB database. The modern frontend features a responsive glassmorphism design, interactive particle effects, and smooth animations, delivering both visual appeal and seamless usability.

---

## Table of Contents

- [SecureMint - Secure Authentication Platform](#securemint---secure-authentication-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [User Authentication](#user-authentication)
    - [Frontend UI/UX](#frontend-uiux)
    - [State Management](#state-management)
    - [Notifications](#notifications)
    - [Routing](#routing)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Tooling](#tooling)
  - [Installation Instructions](#installation-instructions)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Usage](#usage)
  - [Contributing Guidelines](#contributing-guidelines)
  - [License](#license)
  - [Contact](#contact)

---

## Features

### User Authentication
- Secure signup with email, password, and name registration
- JWT-based login authentication
- OTP-based password reset delivered via email
- Protected dashboard accessible only to authenticated users

### Frontend UI/UX
- Responsive glassmorphism design with borders and ribbon-style headers
- Interactive particle animations with hover effects
- Smooth animations: fade-in for cards, scale on hover, slide-in notifications
- Optimized layout for mobile and desktop screens
- Modern dark theme with Quicksand font

### State Management
- Efficient handling with Redux for authentication and notifications
- Custom error boundary component with styling

### Notifications
- Dynamic slide-in notifications for success, error, and info messages with accents

### Routing
- Seamless navigation: signup, login, password reset, and home routes, with a default redirect to login

---

## Technologies Used

### Frontend
- **React** (^18.3.1): Component-based UI library
- **Redux** (react-redux@^9.1.2, @reduxjs/toolkit@^2.2.7): State management
- **react-router-dom** (^6.26.2): Client-side routing
- **react-tsparticles** (^2.12.2), **tsparticles-slim** (^2.12.0): Particle animations
- **react-spring** (^9.7.3): Animation library
- **react-bootstrap** (^5.3.3): Styled components
- **react-icons** (^5.3.0): Icon library
- **axios** (^1.7.7): HTTP client
- **CSS**: Custom styling (glassmorphism, #004030 accents)

### Backend
- **Node.js** (^18.x): JavaScript runtime
- **Express.js** (^4.19.2): Web framework
- **MongoDB** (^6.9.0): NoSQL database
- **jsonwebtoken** (^9.0.2): JWT authentication
- **bcryptjs** (^2.4.3): Password hashing
- **nodemailer** (^6.9.15): Email service
- **cors** (^2.8.5): Cross-origin resource sharing
- **mongoose** (^8.5.2): MongoDB modeling

### Tooling
- **Vite** (^5.4.8): Build tool
- **ESLint** (^9.11.1): Code linting
- **Prettier** (^3.3.3): Code formatting
- **MongoDB Compass**: Optional database UI
- **Postman**: Optional API testing

---

## Installation Instructions

### Prerequisites
- Node.js (>=18.x)
- npm (>=9.x)
- MongoDB (local or Atlas)
- Git
- Email service account (e.g., Gmail SMTP)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/alymehroz512/securemint.git
cd backend

# Install dependencies
npm install express mongoose jsonwebtoken bcryptjs nodemailer cors dotenv

# Create a .env file in the backend directory with the following:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securemint
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

- Start MongoDB (e.g., `mongod` for local, or connect to Atlas)
- Run the backend:
  ```bash
  npm run dev
  nodemon
  ```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install react react-dom @reduxjs/toolkit axios bootstrap react-router-dom react-tsparticles react-spring

# Create a .env file in the frontend directory:
VITE_API_URL=http://localhost:5000/api

# Run the development server
npm run dev

# (Optional) Build for production
npm run build
```

---

## Usage

- Access the app at [http://localhost:5173](http://localhost:5173) after starting both servers.
- Navigate through signup, login, password reset, and the protected dashboard.
- Interact with the particle animations and glassmorphism effects.
- Receive real-time notifications for user actions.

---

## Contributing Guidelines

- Fork the repository.
- Create a feature branch:
  ```bash
  git checkout -b feature/your-feature
  ```
- Commit your changes:
  ```bash
  git commit -m "Add your feature"
  ```
- Push to the branch:
  ```bash
  git push origin feature/your-feature
  ```
- Open a pull request for review.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or collaboration, reach out via:

- **GitHub:** [alymehroz512](https://github.com/alymehroz512)
- **Email:** alimehroz621@gmail.com

---

> **SecureMint** — Built with security and style.
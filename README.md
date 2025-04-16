# vidTube Backend

A robust, scalable, and well-documented backend API for a video-sharing platform inspired by YouTube. This project demonstrates advanced backend development skills including RESTful API design, authentication, data aggregation, and integration with third-party services like Cloudinary.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Improvements and Future Work](#improvements-and-future-work)
- [Contact](#contact)

---

## Features

- **User Authentication:** Secure JWT-based authentication, user registration, login, password management, and profile updates with image uploads via Cloudinary.
- **Video Management:** Upload, update, delete, and toggle publish status of videos with metadata aggregation and Cloudinary integration.
- **Comments:** Add, update, and delete comments on videos with proper error handling.
- **Playlists:** Create, update, delete playlists and add or remove videos from playlists.
- **Likes:** Toggle likes on videos, comments, and tweets; retrieve liked videos.
- **Subscriptions:** Subscribe/unsubscribe to channels (users acting as channels) and view subscriber lists.
- **Tweets:** Create, update, delete, and fetch tweets to mimic a microblogging feature.
- **Dashboard Analytics:** Retrieve real-time channel statistics such as total video views, subscribers, total videos, and total likes.
- **Healthcheck:** A simple route (`/api/v1/healthcheck`) to verify that the API is running as expected.
- **RESTful API:** Comprehensive endpoints with consistent error handling and response formatting.
- **Code Quality:** Modular, clean code structure organized into controllers, models, routes, middlewares, and utilities.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (using Mongoose ODM)
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Postman (with optional Jest or Mocha for automated testing)
- **Other Tools:** ESLint, Prettier for code quality; Git & GitHub for version control

---

## Architecture Overview

The project is organized following best practices for scalable backend applications:

- **`src/controllers/`** – Contains business logic for users, videos, comments, playlists, likes, subscriptions, tweets, dashboard, and healthcheck.
- **`src/models/`** – Mongoose models defining schemas for Users, Videos, Comments, Playlists, Likes, Subscriptions, and Tweets.
- **`src/routes/`** – Express routes mapping endpoints to corresponding controllers.
- **`src/middlewares/`** – Custom middleware for authentication, error handling, file uploads, etc.
- **`src/utils/`** – Utility functions and helpers like `ApiError`, `ApiResponse`, and async handler.

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Git](https://git-scm.com/)

### Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/vidTube-backend.git
   cd vidTube-backend

2. **Install Dependencies**

    npm install

3. **Configure Enviornment Variables**

    configure env variables as listed in ".env.sample"

4. **Run the application locally**

    npm start

## API Documentation

    Below is a summary of the available endpoints:

    Healthcheck:
        GET /api/v1/healthcheck — Check if the API is running.

    User Routes: /api/v1/users
        Register, login, refresh tokens, update user profile, update avatar/cover image, get current user details, etc.

    Video Routes: /api/v1/videos
        Upload (publish) videos, update video details, delete videos, and toggle video publish status.

    Comment Routes: /api/v1/comments
        Add, update, delete, and fetch comments for videos.

    Playlist Routes: /api/v1/playlists
        Create, update, delete playlists; add/remove videos to/from playlists; get user playlists; get playlist by ID.

    Like Routes: /api/v1/likes
        Toggle likes on videos, comments, and tweets; get all liked videos.

    Subscription Routes: /api/v1/subscriptions
        Toggle subscription to channels (users acting as channels); fetch channel subscriber list; get subscribed channels for a user.

    Tweet Routes: /api/v1/tweets
        Create, update, delete, and fetch tweets.

    Dashboard Routes: /api/v1/dashboard
        Get channel statistics (total videos, views, subscribers, likes) and list channel videos.

## Testing

**Postman Testing**

1. **Authentication**

    - Use the login endpoint (/api/v1/users/login) to obtain a JWT token.
    - For each request, add the header: Authorization: Bearer <token>.

2. **Endpoint Testing**

    Use Postman to test endpoints across different modules, including:
        - Healthcheck: GET /api/v1/healthcheck
        - User registration & login, video management, comment functionality, playlist management, tweet CRUD, subscription toggling, and dashboard stats.

## Improvements and Future Work

    - Frontend Integration: Consider developing a full-stack solution using React or another framework to enhance user interactivity.
    - Advanced Testing: Implement comprehensive unit and integration tests.
    - Performance Optimization: Add indexing, caching, and rate limiting as your usage grows.
    - CI/CD: Set up continuous integration (e.g., GitHub Actions) for automated testing and deployment.
    - Enhanced API Documentation: Integrate Swagger or similar tools for interactive API documentation.

## Contact

    For any inquiries or suggestions, please reach out via prakhar2001porwal@gmail.com
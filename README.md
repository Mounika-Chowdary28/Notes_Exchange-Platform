# Student Notes Exchange Portal

A comprehensive academic knowledge hub built by students, for students. Share, discover, and master your exams with high-quality notes, previous year papers, and AI-powered study guides.

## 🚀 Features

### Core Functionality
- **Note Sharing**: Upload and share study materials, notes, and papers
- **Smart Search**: Advanced search and filtering by subject, branch, semester
- **Quality Scoring**: AI-powered quality assessment and ratings
- **Bookmarks**: Save and organize your favorite study materials
- **Comments & Discussion**: Engage with other students through threaded comments
- **Voting System**: Upvote/downvote content for community-driven quality control
- **File Management**: Secure file uploads with Cloudinary integration

### User Experience
- **Personalized Dashboard**: Track your learning progress and contributions
- **Trending Content**: Discover popular and recently uploaded materials
- **Smart Recommendations**: AI-powered suggestions based on your study patterns
- **Gamification**: Earn points and climb the leaderboard
- **Responsive Design**: Optimized for desktop and mobile devices

### Administrative Features
- **Analytics Dashboard**: Comprehensive insights for administrators
- **Content Moderation**: Report and manage inappropriate content
- **User Management**: Admin controls for user accounts and permissions

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

### Development Tools
- **Linting**: ESLint
- **Package Management**: npm
- **Version Control**: Git

## 📁 Project Structure

```
FullStack_Project/
├── backend/                    # Node.js/Express API server
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── bookmarkController.js
│   │   ├── commentController.js
│   │   ├── noteController.js
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/                # MongoDB schemas
│   │   ├── Bookmark.js
│   │   ├── Comment.js
│   │   ├── Note.js
│   │   ├── Report.js
│   │   ├── User.js
│   │   └── Vote.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/               # Local file uploads (dev)
│   ├── package.json
│   └── server.js              # Main server file
├── frontend/                   # React/Vite client
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── layouts/           # Page layouts
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Helper functions
│   │   └── data/              # Mock data (dev)
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md                  # Project documentation
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FullStack_Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/notes_exchange
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Frontend Environment Variables** (if needed)
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

### Running the Application

1. **Start MongoDB**
   Make sure MongoDB is running on your system.

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will start on http://localhost:8000

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will start on http://localhost:5173

4. **Access the Application**
   Open http://localhost:5173 in your browser

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Notes
- `GET /api/notes` - Get all notes (with filtering)
- `POST /api/notes` - Upload new note
- `GET /api/notes/:id` - Get note details
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id/notes` - Get user's notes

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:id` - Remove bookmark

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with React, Express, and MongoDB
- Icons by Lucide React
- Animations powered by Framer Motion
- UI components styled with Tailwind CSS

---

**Happy Learning! 📚✨**
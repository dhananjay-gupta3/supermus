# 🎨 Supermus - Animated Resume Analytics Builder

A full-stack, production-ready resume builder application with beautiful animations and real-time analytics. Built for hiring teams and job seekers who want to create standout resumes.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-brightgreen)](https://resume-builder-tau-nine-49.vercel.app/)
![TypeScript](https://img.shields.io/badge/TypeScript-95.3%25-3178c6)
![Status](https://img.shields.io/badge/Status-Active-success)

## ✨ Features

- **Interactive Resume Builder** - Intuitive interface for creating professional resumes
- **Animated Components** - Smooth transitions and micro-interactions powered by Framer Motion
- **Analytics Dashboard** - Track resume metrics and application insights with Recharts
- **Form Validation** - Type-safe form handling with Zod and React Hook Form
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Data Persistence** - MongoDB backend for reliable data storage
- **Modern Stack** - Next.js 14, Express.js, TypeScript throughout
- **API Versioning** - Clean, maintainable REST API with versioned routing

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: React-Bootstrap, Bootstrap
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: Clean versioned API routing

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- Git

## 🛠️ Local Development Setup

### Quick Start

```bash
# Clone the repository
git clone https://github.com/dhananjay-gupta3/supermus.git
cd supermus
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **`http://localhost:3000`**

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at: **`http://localhost:4000`**

### Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/supermus
PORT=4000
NODE_ENV=development
```

## 📁 Project Structure

```
supermus/
├── frontend/              # Next.js 14 application
│   ├── app/              # App router pages and layouts
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities and helpers
│   ├── public/           # Static assets
│   └── package.json
├── backend/              # Express.js API server
│   ├── routes/           # Versioned API routes (v1, v2, etc.)
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Express middleware
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel)
The frontend is pre-configured for Vercel:
```bash
npm run build
vercel deploy
```

### Backend Options
- **Railway/Render**: Connect GitHub repository directly
- **Heroku**: Add Procfile with `web: npm run start`
- **AWS/GCP/Azure**: Use Docker or native services

## 📝 Available Scripts

### Frontend
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with auto-reload (nodemon)
npm run build    # TypeScript compilation
npm run start    # Start production server
```

## 🔌 API Endpoints

The backend provides versioned REST API endpoints:
- `GET/POST /api/v1/resumes` - Resume CRUD operations
- `GET /api/v1/analytics` - Analytics and metrics

For detailed API documentation, see the backend README.

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Dhananjay Gupta**
- GitHub: [@dhananjay-gupta3](https://github.com/dhananjay-gupta3)
- Live Demo: [resume-builder-tau-nine-49.vercel.app](https://resume-builder-tau-nine-49.vercel.app/)

## 🤔 Support & Resources

- 🐛 [Report Bug](https://github.com/dhananjay-gupta3/supermus/issues/new?template=bug_report.md)
- 💡 [Request Feature](https://github.com/dhananjay-gupta3/supermus/issues/new?template=feature_request.md)
- 📖 [Frontend Docs](./frontend/README.md)
- 📖 [Backend Docs](./backend/README.md)

---

**Built with ❤️ for the modern hiring era**

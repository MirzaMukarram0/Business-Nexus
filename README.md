# Business-Nexus
Business Nexus is a professional networking platform designed to connect entrepreneurs and investors. The objective is to build a full-stack application that allows users to register as either an investor or entrepreneur, view profiles, send collaboration requests, and communicate via a real-time chat system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Business-Nexus.git
   cd Business-Nexus
   ```

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**:
   - Copy `env.backend.example` to `backend/.env`
   - Copy `env.frontend.example` to `frontend/.env`
   - Update the values in both files

4. **Start development servers**:
   ```bash
   npm run dev
   ```

This will start both frontend (port 3000) and backend (port 5000).

## 📦 Deployment

This project uses separate deployments for frontend and backend:

- **Frontend**: Deployed as a static site on Vercel
- **Backend**: Deployed as a serverless function on Vercel

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Tech Stack

- **Frontend**: React.js, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Deployment**: Vercel

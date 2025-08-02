# Deployment Guide for Business Nexus

## Prerequisites

1. **MongoDB Atlas Account**: Set up a free MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: Push your code to GitHub

## Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/business-nexus
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

## Deployment Steps

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Replace `your-username`, `your-password`, and `your-cluster` in the MONGO_URI

### 2. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard

**Backend Deployment:**
1. **Deploy Backend First**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `backend`
       - Configure Environment Variables:
      - `MONGO_URI`: Your MongoDB connection string
      - `JWT_SECRET`: Your JWT secret key
      - `CORS_ORIGIN`: Your frontend URL (will be set after frontend deployment)
      - `PORT`: 5000 (or leave empty for Vercel to auto-assign)

**Frontend Deployment:**
2. **Deploy Frontend**:
   - Create another project in Vercel
   - Import the same GitHub repository
   - Set the root directory to `frontend`
   - Configure Environment Variables:
     - `REACT_APP_API_URL`: Your backend URL (from step 1)

3. **Update CORS Origin**:
   - Go back to your backend project settings
   - Update `CORS_ORIGIN` to your frontend URL

#### Option B: Deploy via Vercel CLI

**Backend Deployment:**
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```

4. **Set Backend Environment Variables**:
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   vercel env add CORS_ORIGIN
   vercel env add PORT
   ```

**Frontend Deployment:**
5. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

6. **Set Frontend Environment Variables**:
   ```bash
   vercel env add REACT_APP_API_URL
   ```

### 3. Update Environment Variables

After both deployments are complete:

1. **Update Frontend API URL**:
   - Go to your frontend project settings
   - Update `REACT_APP_API_URL` to your backend URL
   - Redeploy frontend

2. **Update Backend CORS Origin**:
   - Go to your backend project settings
   - Update `CORS_ORIGIN` to your frontend URL
   - Redeploy backend

### 4. Redeploy Both Projects

After updating environment variables:

```bash
# Redeploy frontend
cd frontend
vercel --prod

# Redeploy backend
cd backend
vercel --prod
```

## Local Development

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

This will start both frontend (port 3000) and backend (port 5000).

## Important Notes

1. **Environment Variables**: Never commit `.env` files to Git
2. **MongoDB**: Use MongoDB Atlas for production (free tier available)
3. **CORS**: Update CORS_ORIGIN to match your frontend domain
4. **JWT Secret**: Use a strong, random secret for production
5. **Build Process**: Vercel will automatically build both frontend and backend

## Troubleshooting

### Common Issues

1. **404 Errors**: Ensure your API routes are properly configured
2. **CORS Errors**: Check that CORS_ORIGIN matches your frontend domain
3. **MongoDB Connection**: Verify your connection string is correct
4. **Environment Variables**: Ensure all variables are set in Vercel dashboard

### Debugging

1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Test API endpoints using Postman or similar tools
4. Check browser console for frontend errors

## Security Considerations

1. **JWT Secret**: Use a strong, random string
2. **MongoDB**: Enable network access controls
3. **Environment Variables**: Keep secrets secure
4. **CORS**: Only allow necessary origins
5. **HTTPS**: Vercel provides SSL certificates automatically 
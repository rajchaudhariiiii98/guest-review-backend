# Guest Review Backend

A Node.js/Express API for managing guest reviews and analytics.

## Features

- User management
- Review management
- Promotions
- Events
- Analytics

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/guest-review-db
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Render

### Prerequisites

You need a MongoDB database. You can use:

1. **MongoDB Atlas** (Recommended)
   - Sign up at https://www.mongodb.com/atlas
   - Create a free cluster
   - Get your connection string

2. **Render MongoDB Service**
   - Create a new MongoDB service in your Render dashboard
   - It will automatically provide the connection string

### Environment Variables

In your Render service, add these environment variables:

- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: Set to `production`

### Example MongoDB Atlas Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/guest-review-db
```

### Health Check

After deployment, you can check if your service is running by visiting:
```
https://your-service-name.onrender.com/api/health
```

This will return:
```json
{
  "message": "Guest Review Management API is running!",
  "mongodb": "connected"
}
```

## API Endpoints

- `GET /api/health` - Health check
- `/api/users` - User management
- `/api/reviews` - Review management
- `/api/promotions` - Promotions
- `/api/events` - Events
- `/api/analytics` - Analytics

## Troubleshooting

If you see MongoDB connection errors:

1. Check that your `MONGODB_URI` environment variable is set correctly
2. Ensure your MongoDB database is accessible from Render's servers
3. If using MongoDB Atlas, make sure your IP whitelist includes `0.0.0.0/0` for Render
4. Check the health endpoint to see the MongoDB connection status 
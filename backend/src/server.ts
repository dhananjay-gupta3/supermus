import app from './app';
import connectDatabase from './config/database';

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI;

const startServer = async () => {
  try {
    await connectDatabase(mongoUri);
  } catch (error) {
    console.warn('⚠️  Database connection failed. Starting server without MongoDB.', error);
  }

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();

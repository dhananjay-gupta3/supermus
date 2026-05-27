import mongoose from 'mongoose';

const connectDatabase = async (mongoUri: string | undefined) => {
  if (!mongoUri) {
    console.warn('⚠️  No MONGO_URI provided. Backend will start without MongoDB connection.');
    return;
  }

  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB connected');
};

export default connectDatabase;

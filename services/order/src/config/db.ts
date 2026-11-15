import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food_delivery_order";
    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || "food_delivery_order",
    });
    console.log(`[Order Service] MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[Order Service] MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;

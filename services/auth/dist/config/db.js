import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food_delivery_auth";
        const conn = await mongoose.connect(mongoUri, {
            dbName: process.env.MONGO_DB_NAME || "food_delivery_auth",
        });
        console.log(`[Auth Service] MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[Auth Service] MongoDB connection error: ${error.message}`);
        // Don't kill process in dev mode if DB is momentarily unreachable
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
};
export default connectDB;

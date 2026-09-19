import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not defined in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.error("Mongodb connection failed", error.message);
        process.exit(1);
    }
};

export default connectDB;
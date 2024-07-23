import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

type connectionObject = {
    isConnected?:Number,
};

const connections : connectionObject = {};

async function DbConnection() : Promise<void> {
    // Check if Already Hava Connection or not
    if(connections.isConnected){
        console.log("Already Connected");
        return;
    }
    try {
        if(!process.env.MONGODB_URL){
            console.log("MONGODB_URL is Not Defined in Env file");
        }

        const mongoDbUrl = process.env.MONGODB_URL;

        const response = await mongoose.connect(mongoDbUrl as string);
        connections.isConnected = response.connections[0].readyState;
        console.log("Connected to Mongo DataBase");
    } catch (error) {
        console.error("DataBase Connection Failed", error);
        process.exit(1);
    }
}

export default DbConnection;


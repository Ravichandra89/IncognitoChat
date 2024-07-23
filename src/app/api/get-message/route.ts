import DbConnect from "@/lib/DbConnection";
import userModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Write here the logic for the Get message Request
export default async function GET(request: Request) {
  // Connect with DataBase
  await DbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 400 }
    );
  }

  // Got the UserId
  const userId = new mongoose.Types.ObjectId(_user._id);

  // Logic to build MongoDB Aggregation Pipeline
  try {
    const user = userModel
      .aggregate([
        { $match: { _id: userId } },
        { $unwind: "$messages" },
        { $sort: { "messages.createdAt": -1 } },
        { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      ])
      .exec();

    if (!user || user.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while fetching the messages",
      }),
      { status: 400 }
    );
  }
}

import DbConnect from "@/lib/DbConnection";
import userModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await DbConnect();
  const { username, content } = await request.json();

  try {
    const user = await userModel.findOne({ username }).exec();

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 400 }
      );
    }

    // Check User Message Acceptange Status
    if (!user.isAcceptingMessages) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User Not Accepting Messages",
        }),
        { status: 400 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessagea as Message);
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding message", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error adding message",
      }),
      { status: 400 }
    );
  }
}

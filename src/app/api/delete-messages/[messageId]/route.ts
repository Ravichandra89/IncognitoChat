import DbConnect from "@/lib/DbConnection";
import userModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { Message } from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import { Contrast } from "lucide-react";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await DbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User Not Authenticated",
      }),
      { status: 404 }
    );
  }

  // Logic to Dlete the message by MessageId

  try {
    const result = await userModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message Not Found Or Already Deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "message is Deleted Successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Deleting Message",
      }),
      { status: 404 }
    );
  }
}

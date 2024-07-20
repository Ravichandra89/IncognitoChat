import DbConnect from "@/lib/DbConnection";
import userModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

/*
  1. Post Request to Change Status Of Accepting Message or Not
  2. Get Request to got status of accepting message
*/

export async function POST(request: Request) {
  await DbConnect();

  const session = getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 400 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  // Update the UserMessage Acceptance
  try {
    const userFound = await userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!userFound) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unable to find user to update message acceptance status",
        }),
        { status: 400 }
      );
    }

    // Than Successfully Updated the status
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully",
        userFound,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Updating Message Acceptance Status!",
      }),
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  await DbConnect();

  const session = getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 400 }
    );
  }

  try {
    const foundUser = await userModel.findById(user._id);

    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 400 }
      );
    }

    // Return The IsAcceptingMessages status to user
    return new Response(
      JSON.stringify({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error retrieving message acceptance status",
      }),
      { status: 400 }
    );
  }
}

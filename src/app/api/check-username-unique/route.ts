import { z } from "zod";
import DbConnect from "@/lib/DbConnection";
import userModel from "@/models/User";
import { usernameValidation } from "@/Schema/SignUp";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

async function GET(request: Request) {
  // Connect with DataBase
  await DbConnect();

  try {
    // Fetch Url and Extract username from url query
    const { searchParams } = new URL(request.url);
    const querySearchParams = {
      username: searchParams.get("username"),
    };

    const res = UsernameQuerySchema.safeParse(querySearchParams);

    if (!res.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid Query Parameters",
        }),
        { status: 400 }
      );
    }

    const { username } = res.data;

    // Check in DataBase that userExistOrNot
    const ExistUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (ExistUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username Is Already Taken",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username Is Available",
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error Checking While Username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Checking While Username",
      }),
      { status: 400 }
    );
  }
}

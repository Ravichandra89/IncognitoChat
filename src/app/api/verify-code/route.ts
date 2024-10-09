import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // Find the user by username
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Log both the user code and submitted code for comparison
    console.log(`Submitted code: ${code}`);
    console.log(`Stored code: ${user.verifyCode}`);

    // Log current time and verification expiry time
    const currentTime = new Date();
    console.log(`Current time: ${currentTime}`);
    console.log(`Verification code expiry time: ${user.verifyCodeExpiry}`); // Change here

    // Check if the submitted code matches the stored code
    const isCodeValid = user.verifyCode === code;

    // Check if the code has expired
    const isCodeNotExpired = currentTime < new Date(user.verifyCodeExpiry); // Change here

    if (isCodeValid && isCodeNotExpired) {
      // Update user's verification status
      user.isVerified = true;
      await user.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account verified successfully",
        }),
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        }),
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return new Response(
        JSON.stringify({
          success: false,
          message: "Incorrect verification code",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error verifying user" }),
      { status: 500 }
    );
  }
}

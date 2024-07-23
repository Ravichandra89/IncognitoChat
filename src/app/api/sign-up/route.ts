import dbConnect from "@/lib/DbConnection";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { SendVerification } from "@/Helpers/SendVerification";

export async function POST(request: Request) {
  // Call the DbConnect function
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Find this user Exist or Not
    const existingUserByUserName = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUserName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generating the OTP
    const existingUserByEmail = await User.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const saltRounds = 10;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email is already taken",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpireAt = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // Create New User - Encrypting password by bcrypt
      const hashedPass = await bcrypt.hash(password, saltRounds);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        password: hashedPass,
        email,
        verifyCode,
        verifyCodeExpireAt: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // Send The Verification Code - Use the SendVerification() Method
    const emailResponse = await SendVerification(email, username, verifyCode);

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User Created Successfully!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error Registering User", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

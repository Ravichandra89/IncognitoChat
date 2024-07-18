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
    const existingUserByUserName = User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUserName) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Generating the OTP
    const existingUserByEmail = await User.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const saltRounds = 10;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // TODO: Write Here the concept
        return Response.json(
          {
            success: false,
            message: "Email is already taken",
          },
          { status: 400 }
        );
      } else {
        const HashedPassword = await bcrypt(password, saltRounds);
        existingUserByEmail.password = HashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpireAt = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // Create New User - Encrypting password by bcrypt
      const HashedPass = await bcrypt.hash(password, saltRounds);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        password: HashedPass,
        email,
        verifyCode,
        verifyCodeExpireAt: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      newUser.save();
    }

    // TODO: Send The Verification Code - Use the SendVarification
    const emailResponse = await SendVerification(email, username, verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 400 }
      );
    };

    return Response.json({
      success: true,
      message: "User Created Successfully!",
    }, {status : 200});
  } catch (error) {
    console.error("Error Registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}

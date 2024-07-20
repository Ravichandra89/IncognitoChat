import userModel from "@/models/User";
import DbConnect from "@/lib/DbConnection";

export async function POST(request: Request) {
  // Connect to DataBase
  await DbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });

    if (!user) {
      return (
        new Response(
          JSON.stringify({
            success: false,
            message: "User Not Found",
          })
        ),
        { status: 400 }
      );
    }

    // Check Code & VerifyCode
    const isCodeValid = user.verifyCode === code;
    const isCodeExpiry = new Date(user.verifyCodeExpireAt) > new Date();

    if(isCodeValid && isCodeExpiry){
        // IsVerified got True
        user.isVerified = true;
        await user.save();
    } else if (!isCodeExpiry){
        return new Response(JSON.stringify(
            {
                sucess : false,
                message : "Verification code has expired. Please sign up again to get a new code.",
            }
        ), {status : 400})
    } else{
        return new Response(JSON.stringify(
            {
                sucess : false,
                message : "Incorrect verification code",
            }
        ),{status : 400})
    }

  } catch (error) {
    console.error("Error Verifying Code", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Verifying Code",
      }),
      {
        status: 400,
      }
    );
  }
}

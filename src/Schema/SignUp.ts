import {z} from "zod";

export const userNameValidation = z
.string()
.min(2, "Username must be at least 2 character")
.max(20, "Username not more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')

export const SignUpSchema = z.object({
    username : userNameValidation,
    email: z.string().email({message : "Invalid Email format"}),
    password: z
    .string()
    .min(6, "Password Must be at least 6 characters");
})
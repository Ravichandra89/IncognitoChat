import {z} from "zod";

export const SignInSchema = z.object({
    password : z.string(),
    identifier : z.string(),
})

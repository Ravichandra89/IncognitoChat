import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { SignUpSchema } from "@/Schema/SignUp";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "../../../../types/ApiResponse";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceUsername = useDebounceCallback(username, 500);

  const router = useRouter();
  const { toast } = useToast();

  // Zod Form Schema
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Check Unique Username While User Write the name
  useEffect(() => {
    const CheckUniqueUsername = async () => {
      if (debounceUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const res = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          // Take Error from AxiosError
          // Send to user as UsernameMessage
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking UserName"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
  }, [debounceUsername]);

  return <div>page</div>;
};

export default page;

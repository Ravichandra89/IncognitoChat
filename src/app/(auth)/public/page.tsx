"use client";

import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ApiResponse } from "../../../../types/ApiResponse";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "@/Schema/MessageSchema";
import { Loader2 } from "lucide-react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCompletion } from "ai/react";

// Utility function to parse string messages (assumed implementation)
const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessages() {
  const [isLoading, setIsLoading] = useState(false);

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const params = useParams<{ username: string }>();
  const username = params.username || "Ravi";

  const { toast } = useToast();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch("content");

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  // Sending Messages Using /api/send-messages with data & Username
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        description: "Message Sent Successfully.",
        variant: "default",
      });

      // Reset the Form to send Another Message
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestMessages = async () => {
    try {
      await complete("");
    } catch (error) {
      console.error("Failed to suggest messages", error);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Send & Loader Button */}
          <div className="flex justify-center">
            {isLoading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait!
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="mt-0">
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* AI Suggest Message */}
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={handleSuggestMessages}
            disabled={isSuggestLoading}
            className="my-4"
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        {/* Card Field for AI Suggest Messages */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

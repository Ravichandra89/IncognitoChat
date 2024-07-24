"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useCallback, useEffect } from "react";
import { Loader2, RefreshCcw, Variable } from "lucide-react";
import { ApiResponse } from "../../../../types/ApiResponse";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { messageAccept } from "@/Schema/AccecptMessage";

function Dashboard() {
  const [messages, setMessages] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  // Zod Resolver
  const from = useForm({
    resolver: zodResolver(messageAccept),
  });

  const { toast } = useToast();
  const { data: session } = useSession();

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Get the status of User Accepting or not
  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast]);

  // Function to trigger IsAcceptingMessages status
  const handleAcceptMessages = useCallback(async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);

      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to update setting",
        variant: "destructive",
      });
    }
  }, [toast, setValue]);

  // Get Messages Function
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setLoadingSwitch(true);

      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing Latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Failed",
          description:
            axiosError.response?.data.message ??
            "Failed To Fetch Refresh Messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoadingSwitch(false);
      }
    },
    [setIsLoading, setLoadingSwitch, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyclickBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url Copied",
      description: "Copied Url To Clipboard",
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  // FrontEnd part

  return (
    <div classgName="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Link</h2>{" "}
        <div>
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />

          <Button onClick={copyclickBoard}>Copy</Button>
        </div>
      </div>

      {/* Add Switch Here */}
      <div className="mb-4">
        <switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleAcceptMessages}
          disable={loadingSwitch}
        />

        <span className="ml-2">
          Accespt Messages : {acceptMessages ? "Yes" : "No"}
        </span>
      </div>

      <Separator />

      {/* Add the Refresh Button */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {IsLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* Add the MessageCard Component  */}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />;
          })
        ) : (
          <p>No messages to display.</p>
        )}
        ;
      </div>
    </div>
  );
}

export default Dashboard;

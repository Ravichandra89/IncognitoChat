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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

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
      setLoading(false);
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
      setLoading(true);
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
        setLoading(false);
        setLoadingSwitch(false);
      }
    },
    [setLoading, setLoadingSwitch, toast]
  );
}

"use client";

import { Store } from "@prisma/client";
import React, { useState } from "react";
import Heading from "./heading";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { FormSchema, FormType } from "@/lib/validators/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: Store;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  });

  const { mutate: updateStore, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ name }: FormType) => {
      const payload: FormType = {
        name,
      };
      const { data } = await axios.patch(
        `/api/stores/${initialData.id}`,
        payload
      );

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          return toast({
            title: "Cannot Found",
            variant: "destructive",
          });
        }

        if (error.response?.status === 401) {
          return toast({
            title: "Unauthorized",
            description:
              "Looks you are not allowed to do that Please Sign in And try again",
            variant: "destructive",
          });
        }
        if (error.response?.status === 500) {
          return toast({
            title: "Internal Server Error while Updating",
            description: "Server face an error while updating the record",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Please Try Again",
      });
    },
    onSuccess: (data: Store) => {
      router.push(`/${data.id}`);
      router.refresh();
      return toast({
        title: "Successfully Updated",
        description: `Successfully updated store ${data.name}`,
        variant: "success",
      });
    },
  });

  const { mutate: deleteStore, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = axios.delete(`/api/stores/${initialData?.id}`);

      return response;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return toast({
            title: "Cannot found",
            variant: "destructive",
          });
        }

        if (error.response?.status === 401) {
          return toast({
            title: "You are not Allowed that",
            description: "Please Login And Try Again",
            variant: "destructive",
          });
        }

        if (error.response?.status === 500) {
          return toast({
            title: "Internal Server Error",
            description: "Its Look Error occured in the server",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something Went Wrong",
        description: "Please Try Again",
      });
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
      return toast({
        title: "Successfully Deleted the Store",
        variant: "success",
      });
    },
  });

  const onSubmit = async (data: FormType) => {
    const payload: FormType = {
      name: data.name,
    };

    updateStore(payload);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage Store preferences" />
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <Trash className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Change your name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;

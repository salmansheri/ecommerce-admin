"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import Modal from "../ui/modal";
import useStoreModal from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { FormSchema, FormType } from "@/lib/validators/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../../hooks/use-toast";

const StoreModal = () => {
  const router = useRouter();
  const storeModal = useStoreModal();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createStore, isLoading: isCreating } = useMutation({
    mutationFn: async ({ name }: FormType) => {
      const payload: FormType = {
        name,
      };

      const { data } = await axios.post("/api/stores", payload);
      return data; 
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          return toast({
            title: "Invalid Data",
            description: "Please Enter a valid data and try again...",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return toast({
            title: "Unauthorized",
            description: "Please Login Before Creating store...",
            variant: "destructive",
          });
        }

        if (error.response?.status === 500) {
          return toast({
            title: "Internal Server Error",
            variant: "destructive",
          });
        }

        if (error.response?.status === 422) {
          return toast({
            title: "Not allowed ",
            description: "You are not allowed to do this",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong", 
        variant: "destructive", 
      })
    },
    onSuccess: (data) => {
      toast({
        title: "Created Successfully",
        description: "Your Store Has Been Created Successfully",
        variant: "success"
      });

      router.refresh();
    },
  });

  const onSubmit = (data: FormType) => {
    const payload: FormType = {
      name: data.name,
    };

    createStore(payload);
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the Store Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the Name of the Store
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isCreating}
                  onClick={storeModal.onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating" : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;

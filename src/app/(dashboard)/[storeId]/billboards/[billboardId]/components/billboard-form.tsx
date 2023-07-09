"use client";

import Heading from "@/components/heading";
import ImageUpload from "@/components/image-upload";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "@/hooks/use-toast";
import { BillboardSchema, BillboardType } from "@/lib/validators/billboard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

 
  const form = useForm<BillboardType>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData || {
      label: "", 
      imageUrl: "", 
    }
  });

  const { mutate: onClick, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ label, imageUrl }: BillboardType) => {
      const payload: BillboardType = {
        label, 
        imageUrl, 
      };

      if(initialData) {
        const { data } = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, payload); 

        return data; 

      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/billboard}`,
          payload,
        );
        return data;
       

      }

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
        variant: "destructive",
      });
    },
    onSuccess: (data: Billboard) => {
      // router.push(`/${data.id}`);
      router.refresh();
      return toast({
        title: "Successfully Updated",
        description: `Successfully updated store ${data.label}`,
        variant: "success",
      });
    },
  });

  const { mutate: deleteStore, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}}`);

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
      // router.push("/");
      router.refresh();
      return toast({
        title: "Successfully Deleted the Store",
        variant: "success",
      });
    },
  });

  const onSubmit = async (data: BillboardType) => {
    const payload: BillboardType = {
      label: data.label,
      imageUrl: data.imageUrl
    };

    onClick(payload);
  };

  const title = initialData ? "Edit Billboard" : "Add Billboard"; 
  const description = initialData ? "Edit the Billboard" : "Add a Billboard"; 
  const toastMessage = initialData ? "BillboardUpdated" : "Created Billboard"; 
  const action = initialData ? "Save Changes" : "Create Billboard"; 



  return (
    <>
      <AlertModal
        isOpen={open}
        isLoading={isDeleting}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteStore()}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (

        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <Trash className="h-5 w-5" />
        </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
           <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []}
                      disabled={false}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}

                    />
                  </FormControl>
                  <FormDescription>Image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the label" />
                  </FormControl>
                  <FormDescription>Enter Label</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

           
          </div>
          <Button className="" type="submit">
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{action}</>
            )}
          </Button>
        </form>
      </Form>
      <Separator />

     
    </>
  );
};

export default BillboardForm;

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
import { toast } from "@/hooks/use-toast";
import {
  BillboardSchema,
  BillboardType,
} from "@/lib/validators/billboard-schema";
import { SizesSchema, SizesType } from "@/lib/validators/sizes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Size } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface SizesFormProps {
  initialData?: Size | null;
}

const SizesForm: React.FC<SizesFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<SizesType>({
    resolver: zodResolver(SizesSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { mutate: onClick, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ name, value }: SizesType) => {
      const payload: SizesType = {
        name,
        value,
      };

      if (initialData) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          payload,
        );

        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/sizes`,
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
              "Looks Like you are not allowed to do that Please Sign in And try again",
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
    onSuccess: (data: Size) => {
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      if (initialData) {
        return toast({
          title: "Successfully Updated",
          description: `Successfully updated billboard ${data.name}`,
          variant: "success",
        });
      }

      return toast({
        title: "Created Sizes successfully",
        description: "Successfully Created Billboards",
        variant: "success",
      });
    },
  });

  const { mutate: deleteBillboard, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}}`,
      );

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
            title: "You are not Allowed to do that",
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
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      return toast({
        title: "Successfully Deleted the Size",
        variant: "success",
      });
    },
  });

  const onSubmit = async (data: SizesType) => {
    const payload: SizesType = {
      name: data.name,
      value: data.value,
    };

    onClick(payload);
  };

  const title = initialData ? "Edit Size" : "Add Size";
  const description = initialData ? "Edit the Size" : "Add a Size";

  const action = initialData ? "Save Changes" : "Create Size";

  return (
    <>
      <AlertModal
        isOpen={open}
        isLoading={isDeleting}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteBillboard()}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the Name" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the Value" />
                  </FormControl>
                  <FormDescription>Enter Value</FormDescription>
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

export default SizesForm;

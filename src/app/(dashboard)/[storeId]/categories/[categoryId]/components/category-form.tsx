"use client";

import Heading from "@/components/heading";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { CategorySchema, CategoryType } from "@/lib/validators/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface CategoryFormProps {
  initialData?: Category | null;
  billboards: Billboard[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const { mutate: onClick, isLoading } = useMutation({
    mutationFn: async ({ name, billboardId }: CategoryType) => {
      const payload: CategoryType = {
        name,
        billboardId,
      };

      if (initialData) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          payload,
        );

        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/categories`,
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
    onSuccess: (data: Category) => {
      router.push(`/${params.storeId}/categories`);
      router.refresh();
      if (initialData) {
        return toast({
          title: "Successfully Updated",
          description: `Successfully updated Category ${data.name}`,
          variant: "success",
        });
      }

      return toast({
        title: "Created billboard successfully",
        description: "Successfully Created Category",
        variant: "success",
      });
    },
  });

  const { mutate: deleteCategory, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}}`,
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
      router.push(`/${params.storeId}/categories`);
      router.refresh();
      return toast({
        title: "Successfully Deleted the Store",
        variant: "success",
      });
    },
  });

  const onSubmit = async (data: CategoryType) => {
    const payload: CategoryType = {
      name: data.name,
      billboardId: data.billboardId,
    };

    onClick(payload);
  };

  const title = initialData ? "Edit Category" : "Add Category";
  const description = initialData ? "Edit the Category" : "Add a Category";
  const toastMessage = initialData ? "Category Updated" : "Created Category";
  const action = initialData ? "Save Changes" : "Create Category";

  return (
    <>
      <AlertModal
        isOpen={open}
        isLoading={isDeleting}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteCategory()}
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards?.map((item) => (
                        <SelectItem key={item?.id} value={item?.id}>
                          {item?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="" type="submit">
            {isLoading ? (
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

export default CategoryForm;

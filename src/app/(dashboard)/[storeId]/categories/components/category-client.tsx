"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { CategoryColumn, CategoryColumnProps } from "./columns";
import { BillboardDataTable } from "@/components/table/data-table";
import ApiList from "@/components/api-list";

interface CategoryClientProps {
  categories: CategoryColumnProps[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({ categories }) => {
  console.log(categories);
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories: (${categories?.length})`}
          description="Manage Categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable
        columns={CategoryColumn}
        data={categories}
        searchKey="name"
      />
      <Heading title="API" description="API Calls for Billboards" />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  );
};

export default CategoryClient;

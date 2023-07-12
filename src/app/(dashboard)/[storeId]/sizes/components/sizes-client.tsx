"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { SizesColumn, SizesColumnProps } from "./columns";
import { BillboardDataTable } from "@/components/table/data-table";
import ApiList from "@/components/api-list";

interface SizesClientProps {
  sizes: SizesColumnProps[];
}

const SizesClient: React.FC<SizesClientProps> = ({ sizes }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes: (${sizes?.length})`}
          description="Manage Sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable columns={SizesColumn} data={sizes} searchKey="name" />
      <Heading title="API" description="API Calls for Sizes" />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  );
};

export default SizesClient;

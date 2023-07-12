"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";


import { BillboardDataTable } from "@/components/table/data-table";
import ApiList from "@/components/api-list";
import { ColorsColumn, ColorsColumnType } from "./columns";

interface ColorsClientProps {
  colors: ColorsColumnType[]
}

const ColorsClient: React.FC<ColorsClientProps> = ({ colors }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors: (${colors?.length})`}
          description="Manage Colors for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable columns={ColorsColumn} data={colors} searchKey="name" />
      <Heading title="API" description="API Calls for Sizes" />
      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};

export default ColorsClient;

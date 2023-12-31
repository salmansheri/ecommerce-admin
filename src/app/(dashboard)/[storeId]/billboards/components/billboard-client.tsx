"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { BillboardColumn, BillboardColumnType } from "./columns";
import { BillboardDataTable } from "@/components/table/data-table";
import ApiList from "@/components/api-list";

interface BillboardClientProps {
  billboards: BillboardColumnType[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ billboards }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards: (${billboards?.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable
        columns={BillboardColumn}
        data={billboards}
        searchKey="label"
      />
      <Heading title="API" description="API Calls for Billboards" />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default BillboardClient;

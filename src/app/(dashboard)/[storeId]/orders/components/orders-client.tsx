"use client";

import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import ApiList from "@/components/api-list";
import { BillboardDataTable } from "@/components/table/data-table";
import { OrderColumn, OrderColumnType } from "./columns";

interface OrderClientProps {
  orders: OrderColumnType[];
}

const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders: (${orders?.length})`}
          description="Manage orders for your store"
        />
        {/* <Button
          onClick={() => router.push(`/${params.storeId}/orders/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button> */}
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable
        columns={OrderColumn}
        data={orders}
        searchKey="products"
      />
      {/* <Heading title="API" description="API Calls for Orders" />
      <ApiList entityIdName="orderId" entityName="orders" /> */}
    </>
  );
};

export default OrderClient;

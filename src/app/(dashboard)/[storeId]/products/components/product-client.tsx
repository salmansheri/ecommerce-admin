"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { BillboardDataTable } from "@/components/table/data-table";
import ApiList from "@/components/api-list";
import { ProductColumn, ProductColumnType } from "./columns";

interface ProductClientProps {
  products: ProductColumnType[];
}

const ProductClient: React.FC<ProductClientProps> = ({ products }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products: (${products?.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      {/* DATA TABLE  */}
      <BillboardDataTable
        columns={ProductColumn}
        data={products}
        searchKey="label"
      />
      <Heading title="API" description="API Calls for Products" />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
};

export default ProductClient;

import prisma from "@/lib/prismaDB";
import { Metadata } from "next";

import { format } from "date-fns";
import { ProductColumnType } from "./components/columns";
import ProductClient from "./components/product-client";
import { formatter } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products - Admin Dashboard",
  description: "All Products here",
};

export default async function ProductPage({
  params,
}: {
  params: { storeId: string };
}) {
  var products = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumnType[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isArchieved: item.isArchieved,
    isFeatured: item.isFeatured,
    size: item.size.name,

    price: formatter.format(item.price),
    category: item.category.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
}

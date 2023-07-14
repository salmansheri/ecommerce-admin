import prisma from "@/lib/prismaDB";

import { Metadata } from "next";
import ProductForm from "./components/product-form";

export const metadata: Metadata = {
  title: "Products - Admin Dashboard",
};

export default async function EditProductPage({
  params,
}: {
  params: {
    productId: string;
    storeId: string;
  };
}) {
  var products = await prisma.product.findFirst({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          // @ts-ignore
          initialData={products}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

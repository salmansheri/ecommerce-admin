import prisma from "@/lib/prismaDB";
import ProductForm from "../[productId]/components/product-form";

export default async function NewProductPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="p-20">
      <ProductForm categories={categories} colors={colors} sizes={sizes} />
    </div>
  );
}

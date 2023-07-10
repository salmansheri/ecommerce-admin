import prisma from "@/lib/prismaDB";
import { Billboard, Category } from "@prisma/client";
import { Metadata } from "next";
import CategoryForm from "./components/category-form";
import { getBillboard } from "@/lib/actions/getBillboards";

export const metadata: Metadata = {
  title: "Categories - Admin Dashboard",
};

export default async function CategoryPage({
  params,
}: {
  params: {
    categoryId: string;
    storeId: string;
  };
}) {
  var categories: Category | null = await prisma.category.findFirst({
    where: {
      id: params.categoryId,
    },
  });

  const billboards: Billboard[] = await getBillboard(params.storeId);
  console.log(billboards);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={categories} />
      </div>
    </div>
  );
}

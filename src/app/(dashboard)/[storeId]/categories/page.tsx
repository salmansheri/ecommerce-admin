import prisma from "@/lib/prismaDB";

import { Metadata } from "next";
import { CategoryColumn, CategoryColumnProps } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/category-client";

export const metadata: Metadata = {
  title: "Categories - Admin Dashboard",
  description: "All billboards here",
};

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  var categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumnProps[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
}

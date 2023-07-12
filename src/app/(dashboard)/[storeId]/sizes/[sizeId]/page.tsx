import prisma from "@/lib/prismaDB";
import { Billboard, Size } from "@prisma/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import BillboardForm from "./components/sizes-form";
import SizesForm from "./components/sizes-form";

export const metadata: Metadata = {
  title: "Sizes - Admin Dashboard",
};

export default async function BillboardPage({
  params,
}: {
  params: {
    sizeId: string;
    storeId: string;
  };
}) {
  var size: Size | null = await prisma.size.findFirst({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} />
      </div>
    </div>
  );
}

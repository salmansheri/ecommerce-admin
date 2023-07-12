import prisma from "@/lib/prismaDB";
import { Color } from "@prisma/client";
import { Metadata } from "next";

import ColorsForm from "./components/color-form";

export const metadata: Metadata = {
  title: "Colors - Admin Dashboard",
};

export default async function BillboardPage({
  params,
}: {
  params: {
    colorId: string;
    storeId: string;
  };
}) {
  var color: Color | null = await prisma.color.findFirst({
    where: {
      id: params.colorId,
    },
  });

  // console.log(color)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color} />
      </div>
    </div>
  );
}

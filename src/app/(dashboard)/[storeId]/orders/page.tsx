import prisma from "@/lib/prismaDB";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { Metadata } from "next";

import { OrderColumnType } from "./components/columns";
import OrderClient from "./components/orders-client";

export const metadata: Metadata = {
  title: "Orders - Admin Dashboard",
  description: "All Orders here",
};

export default async function OrdersPage({
  params,
}: {
  params: { storeId: string };
}) {
  var orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumnType[] = orders.map((item) => ({
    id: item.id,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0),
    ),
    createdAt: format(item.createdAt, "MM do yyyy"),
    isPaid: item.isPaid,
    phone: item.phone,
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
}

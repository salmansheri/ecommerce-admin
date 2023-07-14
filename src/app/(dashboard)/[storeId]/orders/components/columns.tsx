"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { OrderItem } from "@prisma/client";

export type OrderColumnType = {
  id: string;
  isPaid: boolean;
  address: string;
  totalPrice: string;
  products: string;
  phone: string;
  createdAt: string;
};

export const OrderColumn: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
];

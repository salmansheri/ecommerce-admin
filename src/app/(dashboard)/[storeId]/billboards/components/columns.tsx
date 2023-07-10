"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type BillboardColumnType = {
  id: string;
  label: string;
  createdAt: string;
};

export const BillboardColumn: ColumnDef<BillboardColumnType>[] = [
  {
    accessorKey: "label",
    header: "label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

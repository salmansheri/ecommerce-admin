import { Billboard } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface BillboardCardProps {
  data: Billboard;
}

const BillboardCard: React.FC<BillboardCardProps> = ({ data }) => {
  return (
    <div>
      <Image src={data.imageUrl} alt={data.label} width={500} height={500} />
    </div>
  );
};

export default BillboardCard;

import prisma from "@/lib/prismaDB";
import { BillboardSchema } from "@/lib/validators/billboard-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  },
) {
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const body = await request.json();

    const { imageUrl, label } = BillboardSchema.parse(body);

    if (!imageUrl || !label) {
      return new Response("Data Required", {
        status: 400,
      });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    if (!storeId) {
      return new Response("Store Id is Required", {
        status: 400,
      });
    }

    const billboard = await prisma.billboard.create({
      data: {
        imageUrl,
        label,
        storeId,
      },
    });

    return new Response(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log("BILLBOARD_POST", error);
    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", {
        status: 422,
      });
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  const { storeId } = params;
  try {
    if (!storeId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId,
      },
      include: {
        store: true,
      },
    });

    return new Response(JSON.stringify(billboards), {
      status: 200,
    });
  } catch (error) {
    console.log("BILLBOARD_GET", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

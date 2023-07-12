import prisma from "@/lib/prismaDB";
import { SizesSchema } from "@/lib/validators/sizes-schema";
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

    const { name, value } = SizesSchema.parse(body);

    if (!name || !value) {
      return new Response("Data Required", {
        status: 400,
      });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
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

    const size = await prisma.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(size), {
      status: 200,
    });
  } catch (error) {
    console.log("SIZE_POST", error);
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

    const sizes = await prisma.size.findMany({
      where: {
        storeId,
      },
      include: {
        store: true,
      },
    });

    return new Response(JSON.stringify(sizes), {
      status: 200,
    });
  } catch (error) {
    console.log("SIZE_GET", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

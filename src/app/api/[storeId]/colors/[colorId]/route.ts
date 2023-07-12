import prisma from "@/lib/prismaDB";
import { ColorsSchema } from "@/lib/validators/colors-schema";

import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { colorId: string; storeId: string } },
) {
  try {
    if (!params.colorId) {
      return new Response("Color Id is required", {
        status: 400,
      });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
      include: {
        store: true,
      },
    });

    return new Response(JSON.stringify(color), {
      status: 200,
    });
  } catch (error) {
    console.log("COLOR_GET");
    return new Response("Internal Server Error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { colorId: string; storeId: string } },
) {
  const { colorId } = params;
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const { name, value } = ColorsSchema.parse(body);

    if (!name) {
      return new Response("label is required", {
        status: 400,
      });
    }
    if (!value) {
      return new Response("ImageUrl  is required", {
        status: 400,
      });
    }
    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }
    if (!colorId) {
      return new Response("colorId is required", {
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
      return new Response("Not allowed", {
        status: 400,
      });
    }

    const color = await prisma.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return new Response(JSON.stringify(color), {
      status: 200,
    });
  } catch (error) {
    console.log("COLOR_PATCH", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  const { storeId, colorId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!colorId) {
      return new Response("Not Allowed", {
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

    const color = await prisma.color.delete({
      where: {
        id: colorId,
      },
    });

    return new Response(JSON.stringify(color), {
      status: 200,
    });
  } catch (error) {
    console.log(`COLOR_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

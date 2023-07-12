import prisma from "@/lib/prismaDB";
import { BillboardSchema } from "@/lib/validators/billboard-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  try {
    if (!params.billboardId) {
      return new Response("Billboard Id is required", {
        status: 400,
      });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return new Response(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log("BILLBOARD_GET");
    return new Response("Internal Server Error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  const { billboardId } = params;
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const { imageUrl, label } = BillboardSchema.parse(body);

    if (!label) {
      return new Response("label is required", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new Response("ImageUrl  is required", {
        status: 400,
      });
    }
    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }
    if (!billboardId) {
      return new Response("Store id is required", {
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log("BILLBOARD_PATCH ", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  const { storeId, billboardId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!billboardId) {
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

    const billboard = await prisma.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    return new Response(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log(`BILLBOARD_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

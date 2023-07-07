import prisma from "@/lib/prismaDB";
import { FormSchema } from "@/lib/validators/form-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const { name } = FormSchema.parse(body);

    if (!name) {
      return new Response("Name is required", {
        status: 400,
      });
    }

    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }

    const store = await prisma.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return new Response(JSON.stringify(store), {
      status: 200,
    });
  } catch (error) {
    console.log("STORE_PATCH", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const store = await prisma.store.delete({
      where: {
        id: storeId,
      },
    });

    return new Response(JSON.stringify(store), {
      status: 200,
    });
  } catch (error) {
    console.log(`STORE_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

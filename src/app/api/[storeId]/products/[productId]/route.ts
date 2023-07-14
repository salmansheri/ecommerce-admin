import prisma from "@/lib/prismaDB";

import { ProductSchema } from "@/lib/validators/product-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    if (!params.productId) {
      return new Response("Product Id is required", {
        status: 400,
      });
    }

    const products = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        _count: true,
        color: true,
        size: true,
        store: true,
      },
    });

    return new Response(JSON.stringify(products), {
      status: 200,
    });
  } catch (error) {
    console.log("PRODUCT_GET");
    return new Response("Internal Server Error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  const { productId } = params;
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchieved,
      isFeatured,
    } = ProductSchema.parse(body);

    if (!name) {
      return new Response("label is required", {
        status: 400,
      });
    }
    if (!price) {
      return new Response("ImageUrl  is required", {
        status: 400,
      });
    }
    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }
    if (!productId) {
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

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        categoryId,
        colorId,
        images: {
          deleteMany: {},
        },
        name,
        price,
        sizeId,
        isArchieved,
        isFeatured,
      },
    });

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new Response(JSON.stringify(product), {
      status: 200,
    });
  } catch (error) {
    console.log("PRODUCT_PATCH ", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  const { storeId, productId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!productId) {
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

    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new Response(JSON.stringify(product), {
      status: 200,
    });
  } catch (error) {
    console.log(`PRODUCT_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

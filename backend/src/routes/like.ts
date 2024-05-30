import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { z } from "zod";

export const likeRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

likeRouter.use("/*", async (c: any, next: any) => {
  try {
    const header = await c.req.header("authorization");
    const token = header.split(" ")[1];
    const response = await verify(token, c.env.JWT_SECRET);
    console.log(response);
    if (response) {
      await c.set("userId", response.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        success: false,
        message: "token expired pleased login again",
      });
    }
  } catch (err: any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Something went wrong in auth middleware",
      error: err.message,
    });
  }
});

// like logic
likeRouter.post("/like", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const { postId } = await c.req.json();

    const existingLike = await prisma.like.findUnique({
        where: {
        userId_postId: {
            userId: userId,
            postId: postId,
          },
        }
      });
  
      if (existingLike) {
        return c.json({
          success: false,
          message: 'User has already liked this post.',
        });
      }

    const like = await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });

    const likeCount = await prisma.like.count({
        where: {
          postId: postId,
        },
      });
    return c.json({
      success: true,
      message: "Post liked successfully",
      data: like,
      likeCount:likeCount
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: "Error in liking the post",
      error: error.message,
    });
  }
});

// unlike
likeRouter.post("/unlike", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const { postId } = await c.req.json();

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    const likeCount = await prisma.like.count({
        where:{
            postId:postId
        }
    })

    if (!existingLike) {
      c.status(400);
      return c.json({
        success: false,
        message: "You have not liked this post",
        likeCount:likeCount
      });
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    
    return c.json({
      success: true,
      message: "Post unliked successfully",
      likeCount:likeCount
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: "Error in unliking the post",
      error: error.message,
    });
  }
});

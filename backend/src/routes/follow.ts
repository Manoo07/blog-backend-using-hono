import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { z } from "zod";

export const followRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// middleware
followRouter.use("/*", async (c: any, next: any) => {
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

// following logic
followRouter.post("/follow", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const followerId = c.get("userId");
    const { followingId } = await c.req.json();

    // existing following
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      return c.json({
        success: false,
        message: 'User is already following the other user.',
      });
    }

    // Create a new follow relationship
    await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    // Fetch updated follower and following lists
    const updatedUser = await prisma.user.findUnique({
      where: { id: followerId },
      include: {
        followers: {
          include: {
            follower: true, // Include the follower details
          },
        },
        following: {
          include: {
            following: true, // Include the following details
          },
        },
      },
    });

    // Count followers and following
    const followersCount = await prisma.follower.count({
      where: {
        followingId: followerId,
      },
    });

    const followingCount = await prisma.follower.count({
      where: {
        followerId: followerId,
      },
    });

    return c.json({
      success: true,
      message: 'User followed successfully.',
      data: {
        user: updatedUser,
        followersCount,
        followingCount,
      },
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        message: "Error following user",
        error: error.message,
      },
      500
    );
  }
});

// unfollow
followRouter.post("/unfollow", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const followerId = c.get("userId");
    const { followingId } = await c.req.json();

    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (!existingFollow) {
      return c.json(
        { success: false, message: "Not following this user" },
        400
      );
    }

    await prisma.follower.delete({
      where: {
        id: existingFollow.id,
      },
    });
    return c.json(
      {
        success: true,
        message: "User unfollowed successfully",
      },
      200
    );
  } catch (error: any) {
    return c.json(
      {
        success: false,
        message: "Error unfollowing user",
        error: error.message,
      },
      500
    );
  }
});

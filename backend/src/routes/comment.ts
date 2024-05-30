import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { z } from "zod";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// middleware
commentRouter.use("/*", async (c: any, next: any) => {
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

//   comment to the post
commentRouter.post("/comment", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const { postId, content } = await c.req.json();

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: userId,
      },
    });

    return c.json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error: any) {
    console.log("Error in adding comment", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in adding comment",
      error: error.message,
    });
  }
});

// reply to the comment
commentRouter.post("/comment/reply", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const { parentId, content } = await c.req.json();

    const parentComment = await prisma.comment.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentComment) {
      c.status(404);
      return c.json({
        success: false,
        message: "Parent comment not found",
      });
    }

    const reply = await prisma.comment.create({
      data: {
        content,
        postId: parentComment.postId,
        authorId: userId,
        parentId: parentId,
      },
    });

    return c.json({
      success: true,
      message: "Reply added successfully",
      data: reply,
    });
  } catch (error: any) {
    console.log("Error in adding reply", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in adding reply",
      error: error.message,
    });
  }
});

// Get parent comments for a post
commentRouter.get("/comments/:postId", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const postId = c.req.param("postId");

    // Fetch parent comments for the specified post
    const parentComments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId:null
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return c.json({
      success: true,
      message: "Parent comments fetched successfully",
      data: parentComments,
    });
  } catch (error: any) {
    console.log("Error in fetching parent comments", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in fetching parent comments",
      error: error.message,
    });
  }
});

// get all the replies of a comment
// Get replies to a comment
commentRouter.get("/comments/replies/:commentId", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const commentId = c.req.param("commentId");

    // Fetch replies for the specified comment
    const replies = await prisma.comment.findMany({
      where: {
        parentId:commentId
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return c.json({
      success: true,
      message: "Replies fetched successfully",
      data: replies,
    });
  } catch (error: any) {
    console.log("Error in fetching replies", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in fetching replies",
      error: error.message,
    });
  }
});

// Delete a comment
commentRouter.delete("/comment/:commentId", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const userId = c.get("userId");
    const commentId = c.req.param("commentId");

    // Check if the comment exists and if the user is the author of the comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!comment) {
      c.status(404);
      return c.json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.authorId !== userId) {
      c.status(403);
      return c.json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return c.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleting comment", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in deleting comment",
      error: error.message,
    });
  }
});

// update comment
commentRouter.put("/comment/:commentId", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const userId = c.get("userId");
    const commentId = c.req.param("commentId");
    const { content } = await c.req.json();

    // Check if the comment exists and if the user is the author of the comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!comment) {
      c.status(404);
      return c.json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.authorId !== userId) {
      c.status(403);
      return c.json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    return c.json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error: any) {
    console.log("Error in updating comment", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in updating comment",
      error: error.message,
    });
  }
});

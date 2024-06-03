import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { CreateBlogInput,UpdateBlogInput } from "@heisen_berg79/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// middleware
blogRouter.use("/*", async (c: any, next: any) => {
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

// blog routes

blogRouter.post("/", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorId = await c.get("userId");
    const body = await c.req.json();
    // const success = CreateBlogInput.safeParse(body);
    // if(!success){
    //   return c.json({
    //     success:false,
    //     message:"Invalid inputs are sent"
    //   })
    // }
    const blog = await prisma.post.create({
      data: {
        authorId: authorId,
        title: body.title,
        content: body.content,
        published: true,
      },
    });
    return c.json({
      success: true,
      message: "Blog posted succesfully",
      data: blog,
    });
  } catch (error: any) {
    console.log("Error in posting a blog");
    c.status(411);
    return c.json({
      success: false,
      message: "Error in the posting blog",
      error: error.message,
    });
  }
});

blogRouter.put("/:blogId", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogId = await c.req.param("blogId");
    const body = await c.req.json();
    const success = UpdateBlogInput.safeParse(body);
    if(!success){
      return c.json({
        success:false,
        message:"Invalid inputs are sent"
      })
    }
    const blog = await prisma.post.update({
      where: {
        id: blogId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      success: true,
      message: "Successfully updated the blog",
      data: blog,
    });
  } catch (error: any) {
    console.log("Error in updating the blog");
    c.status(411);
    return c.json({
      success: false,
      message: "Error in the updating the blog",
      error: error.message,
    });
  }
});

blogRouter.get("/bulk", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany({
      include:{
        author:{
          select:{
            firstName:true,
            lastName:true
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
    return c.json({
      success: true,
      message: "All blogs fetched successfully",
      data: blogs,
    });
  } catch (error: any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Error in fetching the blogs",
      error: error.message,
    });
  }
});

blogRouter.get("/:id", async (c: any) => {
  const id = await c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return c.json({
    success: true,
    message: "Successfully fetched the blog by Id ",
    data: blog,
  });
});

blogRouter.get("/", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const authorId = await c.get("userId");
    const blog = await prisma.post.findMany({
      where:{
        authorId:authorId
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ]
    });
    return c.json({
      success: true,
      message: "Blogs feteched successfully",
      data: blog,
    });
  } catch (error: any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Error while fetching the blogs",
      error: error.message,
    });
  }
});

blogRouter.delete('/:id', async (c:any) => {
  try {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const deletedBlog = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return c.json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error: any) {
    console.log("Error in deleting blog", error);
    c.status(500);
    return c.json({
      success: false,
      message: "Error in deleting the blog",
      error: error.message,
    });
  }
});


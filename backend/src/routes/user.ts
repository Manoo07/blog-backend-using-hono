import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { signUpInput,signInInput } from "@heisen_berg79/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const {success} = signUpInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        success:false,
        message: "Incorrect inputs values"
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      c.status(403);
      return c.json({
        success: false,
        error: "User already registered",
      });
    }

    const response = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
    const token = await sign(
      { id: response.id, email: response.email },
      c.env.JWT_SECRET
    );

    return c.json({
      response: response,
      token: token,
    });
  } catch (error: any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Something went wrong in signup route",
      error: error.message,
    });
  }
});

userRouter.post("/signin", async (c: any) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    // const {success} = signInInput.safeParse(body);
    // if(!success){
    //   c.status(411);
    //   return c.json({
    //     success:false,
    //     message: "Incorrect not correct "
    //   })
    // }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        success: false,
        message: "User does not exists , please sign up",
      });
    }

    if (user.password != body.password) {
      return c.json({
        success: false,
        message: "Passwords does not match",
      });
    }
    const token = await sign(
      { id: user.id, email: user.email },
      c.env.JWT_SECRET
    );
    return c.json({
      success: true,
      message: "User signed in successfully",
      token: token,
    });
  } catch (error: any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Something went wrong in signing",
      error: error.message,
    });
  }
});

userRouter.get("/",async(c:any)=>{
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const users = await prisma.user.findMany();

    return c.json({
      success:true,
      message:"All users fetched successfully",
      data: users
    })
  } catch (error:any) {
    c.status(411);
    return c.json({
      success: false,
      message: "Something went wrong in fecthing users",
      error: error.message,
    });
  }
})

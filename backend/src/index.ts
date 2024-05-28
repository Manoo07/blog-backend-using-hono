import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode , sign, verify} from "hono/jwt"
import {z} from 'zod'
import { blogRouter } from './routes/blog'
import { userRouter } from './routes/user'
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET:string
  }
}>()


// middleware
// app.use("api/v1/blog/*",async(c:any,next:any)=>{
//     try{
//       const header = await c.req.header("authorization");
//       const token = header.split(' ')[1]
//       const response = await verify(token,c.env.JWT_SECRET)

//       if(response.id){
//         next()
//       }
//       c.status(403)
//       c.set('userId',response.id)
//       return c.json({
//         success:false,
//         message:"token expired pleased login again"
//       })
//     } catch(err:any){
//       c.status(411)
//       return c.json({
//         success:false,
//         message:"Something went wrong in auth middleware",
//         error: err.message
//       })
//     }
// })


// routes
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);


export default app

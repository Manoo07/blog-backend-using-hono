import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode , sign, verify} from "hono/jwt"
import {z} from 'zod'
import { blogRouter } from './routes/blog'
import { userRouter } from './routes/user'
import { followRouter } from './routes/follow'
import { likeRouter } from './routes/like'
import { commentRouter } from './routes/comment'

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET:string
  }
}>()
// routes
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);
app.route("/api/v1/user",followRouter);
app.route("/api/v1/blog",likeRouter);
app.route("/api/v1/blog",commentRouter);



export default app

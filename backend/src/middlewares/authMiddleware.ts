


app.use("api/v1/blog/*",async(c:any,next:any)=>{
    try{
      const header = await c.req.header("authorization");
      const token = header.split(' ')[1]
      const response = await verify(token,c.env.JWT_SECRET)

      if(response.id){
        next()
      }
      c.status(403)
      c.set('userId',response.id)
      return c.json({
        success:false,
        message:"token expired pleased login again"
      })
    } catch(err:any){
      c.status(411)
      return c.json({
        success:false,
        message:"Something went wrong in auth middleware",
        error: err.message
      })
    }
})
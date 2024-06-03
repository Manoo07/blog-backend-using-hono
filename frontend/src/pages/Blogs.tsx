import React from 'react'
import { Appbar } from '../components/Appbar'
import { BlogCard } from '../components/BlogCard'
import { Loader } from '../components/Loader'
import { useBlogs } from '../hooks/index'
import {BlogSkelton} from '../components/BlogSkelton'
export const Blogs = () => {

  const {loading,blogs} = useBlogs()

  if(loading){
    return (
      <div className="">
        <Appbar/>
          <div className="pt-[20%] flex justify-center flex-col items-center">
          <Loader/>
          </div>
      </div>
    )
  }


  return (
    <div>
            <Appbar/>
  <div className="flex justify-center">

    <div className="my-8 max-w-[52%]">
      {
        blogs.map(blog=><BlogCard id={blog.id} authorName={`${blog.author.firstName} ${blog.author.lastName}`} title={blog.title} content={blog.content} publisedDate={blog.updatedAt}/>)
      }
        </div>
    </div>
    </div>
  

  )
}

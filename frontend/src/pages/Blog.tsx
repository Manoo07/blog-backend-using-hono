import React from 'react'
import { useBlog } from '../hooks/index'
import { FullBlog } from '../components/FullBlog';
import { useParams } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { Loader } from '../components/Loader';

export const Blog = () => {
  const {id} = useParams()
  const {loading,blog} = useBlog({id});

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
      <FullBlog blog={blog}/>
   </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios';
import { BACKEND_URL } from '../config';
// import {Blog as BlogType} from "../pages/Blogs"
interface Blog{
    id: string;
    title: string;
    content: string;
    updatedAt: string;
    author: {
      firstName: string;
      lastName: string;
    };
  }

export const useBlogs = () => {
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
        .then((response:any)=>{
            setBlogs(response.data.data);
            console.log("Blogs Data",response.data.data)
            setLoading(false)
        })
    },[])

  return {
    loading,
    blogs
  }
}

export const useBlog = ({id}:{id:string | undefined})=>{
    console.log("BlogID :",id)
    const [loading,setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
        .then((response:any)=>{
            setBlog(response.data.data);
            console.log("Blogs Data",response.data.data)
            setLoading(false)
        })
    },[id])

  return {
    loading,
    blog
  }
}

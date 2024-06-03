import React from 'react'
import { Appbar } from './Appbar'
import {formatDate} from '../utils/formatDate'
import { Circle } from './BlogCard';
import { Avatar } from './Avatar';


interface Blog{
  "author":{
    "firstName":string;
    "lastName":string;
  };
  "createdAt":string;
  "title":string;
  "content":string;
}

export const FullBlog = ({blog}:{blog:Blog}) => {
  return (
    <div>
      <Appbar/>
        <div className="flex justify-center">
          <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl">
                  <div className="col-span-8">
                  <div className="text-5xl font-extrabold pt-12">
                    {blog.title}
                  </div>
                  <div className="text-slate-500 pt-4">
                    Posted on {formatDate(blog.createdAt)}
                  </div>
                  <div className="py-4" >
                    {blog.content}
                  </div>
                  </div>
                  <div className="col-span-4 pt-11 pl-3">
                    <div className="text-slate-700 text-xl mb-3 pl-3">
                       Author
                    </div>
                    <div className="flex justify-center">
                      <div className="pr-4 flex flex-col justify-center">
                        <Avatar size="big" authorName={blog.author.firstName}/>
                      </div>
                      <div>
                          <div className="text-2xl font-extrabold">
                          {blog.author.firstName} {blog.author.lastName}
                        </div>
                        <div className="text-slate-500 pt-1">
                              Random catch pharse about the author's ablity to 
                        </div>
                      </div>
                    </div>
                      
                  </div>
          </div>
        </div>
    </div>
    
  )
}

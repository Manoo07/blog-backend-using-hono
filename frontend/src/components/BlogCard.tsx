import {Avatar} from './Avatar'
import {formatDate} from '../utils/formatDate'
import {Link} from "react-router-dom"

export interface BlogCardProps{
    authorName:string,
    title:string,
    content:string,
    publishedDate:string,
    id:string
}

export const BlogCard = ({authorName,title,content,publishedDate,id}:BlogCardProps) => {
    console.log(id)
  return (
    <Link to={`/blog/${id}`}>
        <div className="border border-slate-200 pb-4 p-5 mt-4 w-screen max-w-screen-md cursor-pointer">
            <div className="flex align-baseline">
                <div className="flex justify-center flex-col">
                    <Avatar size="small" authorName={authorName}/> 
                </div>
                <div className="flex justify-center flex-col text-lg font-extralight pl-2">
                    {authorName}
                </div>
                <div className="flex justify-center flex-col pl-2 ">
                    <Circle/>
                </div> 
                <div className="flex justify-center flex-col pl-1 font-extralight text-sm text-slate-500">
                    {formatDate(publishedDate)}
                </div>
            </div>
            <div className="text-3xl font-semibold pt-2">
                {title?.slice(0,100) + "..."}
            </div>
            <div className="text-lg font-thin">
                {content?.slice(0,100) + "..."}
            </div>
            <div className="text-xs font-thin  text-slate-600 pt-2">
                {`${Math.ceil(content?.length/1000)} min(s) read`}
            </div>
        </div>
    </Link>
  )
}

export const Circle = ()=>{
    return <div className="w-1 h-1 rounded-full bg-slate-500">
    </div>
}


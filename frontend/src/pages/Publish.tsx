import React,{useState} from 'react'
import { Appbar } from '../components/Appbar'
import { TextEditor } from '../components/TextEditor'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useNavigate } from 'react-router-dom'


export const Publish = () => {

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const navigate = useNavigate()
  return (
    <div>
      <Appbar/>
    <div className="flex justify-center">
            <div className="max-w-screen-lg w-full py-4">
            <input type="text" onChange={(e)=>{
              setTitle(e.target.value)
            }} placeholder="Title" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 "></input>
            <div className="mt-5">
              <TextEditor onChange={(e)=>{setContent(e.target.value)}}/>
              <button
          type="submit"
          onClick={async()=>{
            console.log("Here in clickhandler of post blog")
            await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                title,
                content
            },{
              headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
              }
            })
            navigate("/blogs")
          }}
          className="mt-3 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
        >
          Publish Post
        </button>
            </div>
            </div>
            
        </div>
    </div>
  )
}

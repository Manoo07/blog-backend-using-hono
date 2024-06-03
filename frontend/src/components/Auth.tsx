import { ChangeEventHandler } from "react"
import { Link,useNavigate} from "react-router-dom"
import {SignUpInput} from "@heisen_berg79/medium-common"
import { useState } from "react"
import {LabelledInput} from "../components/LabelledInput"
import { Button } from "./Button"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const Auth = ({type}: {type:"signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs,setPostInputs] = useState<SignUpInput>({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    })

    const sendRequest = async()=>{
        try {
            let url = `${BACKEND_URL}/api/v1/user/`
            if(type==="signin")url = url +"signin"
            else url += "signup"
            console.log("url",url)
            const response = await axios.post(url,postInputs) 
            const jwt = await response.data.token;
            localStorage.setItem("token",jwt);
            navigate("/blogs")

        } catch (error) {
            // alert the user that the request failed
            alert("Error while signing")
        }
    }

  return (
    <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div className="">
                <div className="text-3xl font-extrabold ">
                    Create an account
                </div>
                <div className="text-slate-400">{
                    type==="signin" ? "Don't have an account ?":"Already have an account ?"
                }
                <Link to={type=== "signin" ? "/signup" : "/signin"} className="pl-2 underline">{type=="signin"?"Signup":"Signin"}</Link>
                </div>
                <div>
            { type ==="signin"?(null):(<>
                <LabelledInput label="First Name" placeHolder="John" onChange={(e:any)=>{
                setPostInputs(c =>({
                    ...c,
                    firstName:e.target.value
                }))
            }}/>
            <LabelledInput label="Last Name" placeHolder="Doe" onChange={(e:any)=>{
                setPostInputs(c =>({
                    ...c,
                    lastName:e.target.value
                }))
            }}/>
            </>
            
            )
            }
            <LabelledInput label="Email" placeHolder="Johndoe@email.com" onChange={(e:any)=>{
                setPostInputs(c =>({
                    ...c,
                    email:e.target.value
                }))
            }}/>
            <LabelledInput label="Password" placeHolder="John123" onChange={(e:any)=>{
                setPostInputs(c =>({
                    ...c,
                    password:e.target.value
                }))
            }} type = {"password"} />
            <Button sendRequest = {sendRequest} label={type==="signin"?"Sign In":"Sign Up"}/>
                
                </div>
            </div>
            
        </div>
    </div>
  )
}


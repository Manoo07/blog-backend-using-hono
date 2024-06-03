import { ChangeEvent } from "react"

interface LabelledInputType {
    label:string;
    placeHolder:string;
    onChange:(e: ChangeEvent<HTMLInputElement>)=>void;
    type?:string;
}

export function LabelledInput ({label,placeHolder,onChange,type}:LabelledInputType){
    console.log("type: ",type)
    return <div>
        <div className="">
            <label  className="mt-3 block mb-1 text-sm font-medium font-semibold text-gray-900">{label}</label>
            <input type={ type || "text"}  onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeHolder} required />
        </div>
    </div>
}
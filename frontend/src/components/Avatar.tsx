export const Avatar = ({authorName,size="small"}:{authorName:string,size:string})=>{
    return(<div className={`relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600
    ${size==="small"?"w-7 h-7":"w-9 h-9"}`}>
    <span className={`font-medium ${size=="small"?"text-sm":"text-md"} text-gray-600 dark:text-gray-300`}>{authorName[0]?.toUpperCase()}</span>
</div>)
}
import {Link} from "react-router-dom"


export const TextEditor = ({onChange}:{onChange:(e:any)=>void}) => {
    
  return (
    <div className="">
      <form>
        <textarea
        onChange = {onChange}
          placeholder="Write an article ..."
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        ></textarea>
        
      </form>


      <p className="ms-auto text-sm my-3 flex justif text-gray-500 ">
        Remember, contributions to this topic should follow our
        <Link to="/blogs" className="text-blue-600 dark:text-blue-500 hover:underline">
          {" "}Community Guidelines
        </Link>
        .
      </p>
    </div>
  );
};

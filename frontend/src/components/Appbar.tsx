import { Avatar } from './Avatar'
import {Link} from 'react-router-dom'

export const Appbar = () => {
  return (
    <div className="border-b py-2 flex justify-between px-10">
        <Link to="/blogs">
            <div className="flex flex-col justify-center font-medium text-xl cursor-pointer pt-2">
                Medium
            </div>
        </Link>
        <div className="flex flex-end">
          <Link to="/publish">
                <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2   ">Create Post</button>
          </Link>
          <div className="pl-4">
              <Avatar size="big" authorName="Manohar"/>
          </div>
        </div>
    </div>
  )
}

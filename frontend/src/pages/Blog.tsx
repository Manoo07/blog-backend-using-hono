import { useBlog } from '../hooks/index';
import { FullBlog } from '../components/FullBlog';
import { useParams } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { Loader } from '../components/Loader';

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

interface UseBlogResult {
  loading: boolean;
  blog: Blog | null;
}

export const Blog = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Id in Blog :", id);
  const { loading, blog }: UseBlogResult = useBlog({ id });

  if (loading) {
    return (
      <div className="">
        <Appbar />
        <div className="pt-[20%] flex justify-center flex-col items-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      {blog && <FullBlog blog={blog} />}
    </div>
  );
};

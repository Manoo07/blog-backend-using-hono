import { Appbar } from '../components/Appbar';
import { BlogCard } from '../components/BlogCard';
import { Loader } from '../components/Loader';
import { useBlogs } from '../hooks/index';
// import { BlogSkelton } from '../components/BlogSkelton';
// import { BlogCardProps } from '../components/BlogCard';

export interface Blog {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

// interface UseBlogsResult {
//   loading: boolean;
//   blogs: Blog[];
// }


export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="pt-[20%] flex justify-center flex-col items-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="my-8 max-w-[52%]">
          {blogs.map((blog:Blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={`${blog.author.firstName} ${blog.author.lastName}`}
              title={blog.title}
              content={blog.content}
              publishedDate={blog.updatedAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const BlogDetails = () => {
  const { title } = useParams();

  // Sample blog data - in a real app, you'd fetch this based on the ID
  const blog = {
    id: 1,
    title: "The Art of Reading: How to Develop a Lifelong Habit",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    date: "June 15, 2023",

    content: `
      <p class="mb-4">Developing a reading habit is one of the most rewarding practices you can cultivate. In our fast-paced digital world, carving out time for books can seem challenging, but the benefits make it worth the effort. 
      Take advantage of small pockets of time throughout your day. Waiting in line, during commutes, or lunch breaks are perfect opportunities to read a few pages. Many avid readers credit this practice for helping them finish dozens of books each year.</p>
      
     
    `,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to all articles
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center text-gray-500 space-x-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

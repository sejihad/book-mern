import { Link } from "react-router-dom";

const Blogs = () => {
  const blogs = [
    {
      id: 1,
      title: "The Art of Reading: How to Develop a Lifelong Habit",
      excerpt:
        "Discover practical tips to cultivate reading as a daily habit and transform your life through books.",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      date: "June 15, 2023",
    },
    {
      id: 2,
      title: "10 Must-Read Classics That Stand the Test of Time",
      excerpt:
        "Explore our curated list of timeless classics that every book lover should have on their shelf.",
      image:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      date: "May 28, 2023",
    },
    {
      id: 3,
      title: "Creating the Perfect Reading Nook in Your Home",
      excerpt:
        "Learn how to design a cozy reading space that will make you want to curl up with a book for hours.",
      image:
        "https://images.unsplash.com/photo-1506891536236-3e07892564b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      date: "April 10, 2023",
    },
    {
      id: 4,
      title: "The Benefits of Reading Before Bed",
      excerpt:
        "Science-backed reasons why reading before sleep can improve your health and sleep quality.",
      image:
        "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      date: "March 22, 2023",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blogs</h1>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Blog Image */}
              <div className="h-48 overflow-hidden">
                <Link to={`/blog/${blog.title}`}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{blog.date}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>

                <Link
                  to={`/blog/${blog.title}`}
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;

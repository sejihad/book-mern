import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import book_cat from "../assets/categories/book-cat.png";
import ebook_cat from "../assets/categories/ebook-cat.png";
import kids_cat from "../assets/categories/kids-cat.jpg";

const categories = [
  { name: "EBOOKS", image: book_cat },
  { name: "FICTION", image: ebook_cat },
  { name: "JOB SOLUTIONS", image: kids_cat },
  { name: "KIDS", image: book_cat },
  { name: "ROMANTIC", image: ebook_cat },
  { name: "SKILL", image: kids_cat },
  // Duplicate for infinite scroll
  { name: "EBOOKS", image: book_cat },
  { name: "FICTION", image: ebook_cat },
  { name: "JOB SOLUTIONS", image: kids_cat },
  { name: "KIDS", image: book_cat },
  { name: "ROMANTIC", image: ebook_cat },
  { name: "SKILL", image: kids_cat },
];

const Categories = () => {
  const sliderRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  useEffect(() => {
    const slider = sliderRef.current;

    const startDrag = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const endDrag = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const drag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const autoScroll = () => {
      if (!isDown) {
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 1;
        }
      }
    };

    const interval = setInterval(autoScroll, 20);

    slider.addEventListener("mousedown", startDrag);
    slider.addEventListener("mouseleave", endDrag);
    slider.addEventListener("mouseup", endDrag);
    slider.addEventListener("mousemove", drag);

    return () => {
      clearInterval(interval);
      slider.removeEventListener("mousedown", startDrag);
      slider.removeEventListener("mouseleave", endDrag);
      slider.removeEventListener("mouseup", endDrag);
      slider.removeEventListener("mousemove", drag);
    };
  }, []);

  return (
    <section className="py-10 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Browse by Category
        </h2>
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-1 md:px-4 cursor-grab select-none py-5"
          style={{ scrollBehavior: "smooth" }}
        >
          {categories.map((cat, i) => (
            <Link
              to={`/category/${encodeURIComponent(cat.name.toLowerCase())}`}
              key={i}
              className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] transition-transform hover:scale-110 hover:shadow-xl"
            >
              <div className="bg-white p-4 rounded-full shadow-md hover:ring-2 hover:ring-green-500 transition duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center uppercase tracking-wide">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

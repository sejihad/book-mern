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
    <section className="py-6 container bg-white">
      <div
        ref={sliderRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide px-4 cursor-grab select-none"
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((cat, i) => (
          <Link
            to={`/category/${encodeURIComponent(cat.name.toLowerCase())}`}
            key={i}
            className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] transition-transform hover:scale-105"
          >
            <div className="bg-gray-100 p-6 rounded-full">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-center">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

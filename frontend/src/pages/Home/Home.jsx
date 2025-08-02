import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";

const Home = () => {
  const { loading, books } = useSelector((state) => state.books);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  // ✅ সর্বোচ্চ ১০টা বই স্লাইস করে পাঠাচ্ছি
  const finalBooks = books.slice(0, 10);

  return (
    <>
      <Hero />
      <Categories />
      {/* <Authors /> */}
      <BookSection title="New" books={finalBooks} loading={loading} />
    </>
  );
};

export default Home;

import BookSection from "../../component/BookSection";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";

const Home = () => (
  <>
    <Hero />
    <Categories />
    {/* <Authors /> */}

    <BookSection title="New" />
  </>
);

export default Home;

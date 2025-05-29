import BookSection from "../../components/BookSection";
import Categories from "../../components/Categories";
import Hero from "../../components/Hero";

const Home = () => (
  <>
    <Hero />
    <Categories />
    {/* <Authors /> */}
    <BookSection title="Popular" />
    <BookSection title="Fictional" />
    <BookSection title="New" />
  </>
);

export default Home;

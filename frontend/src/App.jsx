import { Route, Routes } from "react-router-dom";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <AuthModal />
      <Footer />
    </>
  );
};

export default App;

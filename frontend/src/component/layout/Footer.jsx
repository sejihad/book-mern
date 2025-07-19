const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-8">
      <div className="text-center">
        <h2 className="text-green-600 text-xl font-bold">📚 Book Shop</h2>
        <p className="text-sm text-gray-600 mt-2">
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-700">
          <a href="#">Privacy Policy</a>
          <a href="#">Refund & Return</a>
          <a href="#">Seller Dashboard</a>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Developed by{" "}
          <a
            href="https://digitalnexgen.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:underline hover:text-green-700"
          >
            digitalnexgen
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

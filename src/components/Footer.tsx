import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold">Your Company</h2>
          <p className="mt-2 text-gray-400">
            Providing top-notch services with excellence and innovation.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
            <li><a href="/services" className="text-gray-400 hover:text-white">Services</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        
        {/* Contact & Social Media */}
        <div>
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p className="mt-2 text-gray-400">Email: contact@yourcompany.com</p>
          <p className="text-gray-400">Phone: +123 456 7890</p>
          <div className="flex mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FaLinkedin />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-2xl">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

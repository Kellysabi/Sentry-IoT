import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 font-bold text-xl md:text-2xl">
                        SENTRY-IoT
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <a href="/" className="hover:text-blue-200 transition duration-300">Home</a>
                        <a href="/about" className="hover:text-blue-200 transition duration-300">About</a>
                        <a href="/contact" className="hover:text-blue-200 transition duration-300">Contact</a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600">
                        <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                            Home
                        </a>
                        <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                            About
                        </a>
                        <a href="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
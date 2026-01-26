import { MapPin, Twitter, Instagram, FacebookIcon } from "lucide-react";
const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Stays", href: "/stays" },
    { name: "Events", href: "/events" },
    { name: "Experiences", href: "/experiences" },
  ];

  const supportLinks = [
    { name: "Contact", href: "/contact" },
    { name: "Help", href: "/help" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ];
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
              Avira
            </span>
          </div>
          <p className="text-lg text-green-400 font-medium mb-2">
            Travel. Stay. Explore Nigeria 🇳🇬
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connecting Nigerian travelers with authentic cultural experiences
            across Africa. Travel meets culture, one journey at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Contact
            </h3>
            <p className="text-gray-400 text-sm mb-2">Abuja, Nigeria</p>
            <p className="text-gray-400 text-sm">avira@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Avira. All rights reserved. Built with 💚 for Nigerian
            travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

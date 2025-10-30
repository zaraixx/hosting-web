import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-neutral-dark text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center">
          {/* Social Media Icons */}
          <div className="flex items-center gap-6 mb-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-light transition-colors text-2xl"
                aria-label={social.label}
              >
                <social.icon />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center">
            &copy; 2024 Lynx Hosting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

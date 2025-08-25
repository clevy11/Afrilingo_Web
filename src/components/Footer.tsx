
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com/afrilingo',
      twitter: 'https://twitter.com/afrilingo',
      instagram: 'https://instagram.com/afrilingo',
      youtube: 'https://youtube.com/afrilingo'
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleContactClick = (type: 'email' | 'phone') => {
    if (type === 'email') {
      window.location.href = 'mailto:afrilingoedtech@gmail.com';
    } else if (type === 'phone') {
      window.location.href = 'tel:+250788123456';
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/11afa540-f243-4c5a-93e4-f75f0daebf89.png" 
                alt="Afrilingo Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-2xl font-bold">Afrilingo</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting people to African cultures through authentic language learning experiences.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('twitter')}
                className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('youtube')}
                className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Languages</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Swahili</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Yoruba</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Amharic</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Zulu</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Hausa</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">View All</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Partnership</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
            </ul>
            
            <div className="mt-6 space-y-2">
              <button 
                onClick={() => handleContactClick('email')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>afrilingoedtech@gmail.com</span>
              </button>
              <button 
                onClick={() => handleContactClick('phone')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors group"
              >
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>+250 788 123 456</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Afrilingo. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

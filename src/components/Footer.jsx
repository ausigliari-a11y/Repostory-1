import { Car, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 py-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <Car className="h-6 w-6 text-gold-500" />
              <span className="text-lg font-bold">LOMBARDIA NCC CLASS</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium chauffeur services in Milan and throughout Italy. 
              Professionalism, comfort, and punctuality guaranteed.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gold-500" />
                <span>+39 331 228 3310</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gold-500" />
                <span>lombardia.ncc.class@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold-500">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-navy-800 mt-12 pt-8 text-center text-xs">
          <p>&copy; 2015 Lombardia NCC Class. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

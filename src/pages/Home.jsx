import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookingForm } from '../components/booking/BookingForm';
import { Shield, Clock, Star, MapPin } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-300 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1566367329597-d8c973a0d9e2?auto=format&fit=crop&q=80&w=2000" 
             alt="Luxury Chauffeur" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-navy-900/70 gradient-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Travel in <span className="text-gold-500">Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 font-light">
            Premium Chauffeur Service across Lombardy and Italy. 
            Experience the ultimate comfort, privacy, and punctuality.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#booking" className="px-8 py-3 bg-gold-500 text-navy-900 font-bold rounded-full hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
              Book Now
            </a>
            <a href="#services" className="px-8 py-3 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
              Our Services
            </a>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <BookingForm />

      {/* About / Features Section */}
      <section id="about" className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors group">
              <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 transition-colors">
                <Shield className="w-8 h-8 text-gold-500 group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Safety First</h3>
              <p className="text-slate-400">
                Certified professional drivers and sanitized luxury vehicles for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors group">
              <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 transition-colors">
                <Clock className="w-8 h-8 text-gold-500 group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Punctuality</h3>
              <p className="text-slate-400">
                We value your time. Guaranteed on-time pickups and efficient route planning.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors group">
              <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 transition-colors">
                <Star className="w-8 h-8 text-gold-500 group-hover:text-navy-900 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">VIP Experience</h3>
              <p className="text-slate-400">
                First-class service tailored to executives, celebrities, and discerning travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold text-white mb-6">Our Premium Services</h2>
               <p className="text-slate-400 mb-8 text-lg">
                 Whether it's an airport transfer, a corporate event, or a long-distance journey across Europe, we provide the perfect solution.
               </p>
               
               <ul className="space-y-4">
                 {[
                   "Airport Transfers (Malpensa, Linate, Orio)",
                   "Corporate Chauffeur Service",
                   "Long Distance Travel across Europe",
                   "Events & Weddings",
                   "Hourly Disposal",
                   "Ski Transfers to the Alps"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-slate-200">
                     <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1554665802-5326a2636a6e?auto=format&fit=crop&q=80&w=800" 
                  alt="Chauffeur Service" 
                  className="w-full h-full object-cover"
                />
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

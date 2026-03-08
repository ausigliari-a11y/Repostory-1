import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MapComponent } from './MapComponent';
import { VehicleList } from './VehicleList';
import { Modal } from '../ui/Modal';
import { MapPin, Navigation, Loader2, Phone, Copy, Check } from 'lucide-react';
import { MOCK_DRIVERS } from '../../utils/mockData';

export const BookingForm = () => {
  const { 
    pickup,
    setPickup, 
    dropoff,
    setDropoff, 
    calculateRoute, 
    loadingDistance, 
    distance, 
    priceData, 
    bookingStep, 
    selectedVehicle,
    resetBooking,
    addBooking,
    updateBookingCustomerEmail
  } = useBooking();

  const { width } = useWindowSize();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (pickup && dropoff) {
      calculateRoute(pickup, dropoff);
    }
  };

  const generateMessage = () => {
    return `Salve, richiesta prenotazione NCC. Da: ${pickup} A: ${dropoff}. Prezzo stimato: €${priceData?.price}. Veicolo: ${selectedVehicle?.name}. Attendo conferma.`;
  };

  const handleBookNow = () => {
    if (!selectedVehicle || !priceData?.price) return;

    const message = generateMessage();
    const driver = MOCK_DRIVERS[0];
    const date = new Date().toISOString().slice(0, 10);
    const id = Date.now();

    addBooking({
      id,
      from: pickup,
      to: dropoff,
      date,
      vehicleType: selectedVehicle.name,
      driver: driver.name,
      price: priceData.price,
      status: 'Pending',
      customerEmail: '',
    });
    setCurrentBookingId(id);

    if (width < 768) {
      const encodedMsg = encodeURIComponent(message);
      window.location.href = `https://wa.me/${driver.phone.replace(/\s+/g, '')}?text=${encodedMsg}`;
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCopyMessage = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveReceiptEmail = async () => {
    if (!currentBookingId) return;
    const email = customerEmail.trim();
    if (!email) {
      alert('Inserisci una email valida');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Formato email non valido');
      return;
    }
    updateBookingCustomerEmail(currentBookingId, email);
    if (!selectedVehicle || !priceData?.price) return;
    setSendingReceipt(true);
    const driver = MOCK_DRIVERS[0];
    const route = `${pickup} → ${dropoff}`;
    try {
      const res = await fetch('http://localhost:3001/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: email,
          driverName: driver.name,
          driverPiva: driver.piva,
          driverFiscalCode: driver.fiscalCode,
          vehicle: selectedVehicle.name,
          route,
          price: priceData.price,
        }),
      });
      if (!res.ok) {
        throw new Error('Send failed');
      }
      alert('Ricevuta inviata via email');
    } catch (e) {
      alert('Invio email fallito. Configura il server e le credenziali Gmail.');
    } finally {
      setSendingReceipt(false);
    }
  };

 

  return (
    <section id="booking" className="py-20 bg-navy-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Transfer</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get an instant quote and book your luxury ride in minutes. 
            Transparent pricing, no hidden fees.
          </p>
        </div>

        <div className="bg-navy-800 rounded-2xl shadow-2xl overflow-hidden border border-navy-700">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Panel: Form */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${bookingStep >= 1 ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-slate-400'}`}>1</div>
                <div className="h-0.5 w-16 bg-navy-700"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${bookingStep >= 2 ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-slate-400'}`}>2</div>
                <div className="h-0.5 w-16 bg-navy-700"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${bookingStep >= 3 ? 'bg-gold-500 text-navy-900' : 'bg-navy-700 text-slate-400'}`}>3</div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="relative">
                  <Input 
                    label="Pick-up Location" 
                    placeholder="e.g. Milan Malpensa Airport" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    disabled={bookingStep > 1}
                    icon={<MapPin className="text-gold-500" />}
                  />
                </div>
                <div className="relative">
                  <Input 
                    label="Drop-off Location" 
                    placeholder="e.g. Hotel Principe di Savoia, Milan" 
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    disabled={bookingStep > 1}
                  />
                </div>

                {priceData?.error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                    {priceData.error}
                  </div>
                )}

                {bookingStep === 1 && (
                  <Button 
                    type="submit" 
                    disabled={!pickup || !dropoff || loadingDistance}
                    className="w-full mt-4"
                  >
                    {loadingDistance ? <Loader2 className="animate-spin" /> : <Navigation className="w-4 h-4" />}
                    Calculate Route
                  </Button>
                )}
                
                {bookingStep > 1 && (
                   <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-lg border border-navy-700">
                     <div>
                       <p className="text-sm text-slate-400">Distance</p>
                       <p className="text-xl font-bold text-white">{distance} km</p>
                     </div>
                     <div>
                        <p className="text-sm text-slate-400 text-right">Tier</p>
                        <p className="text-sm font-semibold text-gold-500">{priceData?.tier?.label}</p>
                     </div>
                     <Button variant="outline" size="sm" onClick={resetBooking} className="py-1 px-3 text-xs">
                       Change Route
                     </Button>
                   </div>
                )}
              </form>

              {bookingStep >= 2 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold mb-4 text-white">Select Vehicle</h3>
                  <VehicleList />
                  
                  {selectedVehicle && (
                    <div className="mt-8 pt-6 border-t border-navy-700 flex justify-end">
                      <Button 
                        onClick={handleBookNow} 
                        className="w-full md:w-auto text-lg px-8"
                      >
                        Book Now - €{priceData?.price}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Map */}
            <div className="h-[400px] lg:h-auto w-full relative">
               <MapComponent />
               <div className="absolute top-4 right-4 z-[400] bg-navy-900/80 backdrop-blur text-xs p-2 rounded border border-navy-700 text-slate-300">
                  Map Preview
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Desktop Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Contact Driver"
      >
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
             <img 
               src={MOCK_DRIVERS[0].photo} 
               alt={MOCK_DRIVERS[0].name} 
               className="w-24 h-24 rounded-full border-4 border-gold-500 object-cover shadow-lg"
             />
             <div>
               <h4 className="text-xl font-bold text-white">{MOCK_DRIVERS[0].name}</h4>
               <p className="text-slate-400">Professional Chauffeur</p>
             </div>
          </div>

          <div className="bg-navy-900 p-4 rounded-lg border border-navy-700 flex items-center justify-center gap-3">
            <Phone className="text-gold-500" />
            <span className="text-2xl font-mono text-white">{MOCK_DRIVERS[0].phone}</span>
          </div>

          <div className="space-y-2 text-left">
            <Input 
              label="Email per ricevuta (facoltativo)" 
              type="email" 
              placeholder="nome@email.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <Button onClick={handleSaveReceiptEmail} className="w-full" disabled={sendingReceipt}>
              {sendingReceipt ? 'Invio...' : 'Salva email per ricevuta'}
            </Button>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm text-slate-400">Pre-formatted Message:</label>
            <textarea 
              readOnly 
              className="w-full bg-navy-900 border border-navy-700 rounded p-3 text-sm text-slate-300 h-32 focus:outline-none resize-none"
              value={generateMessage()}
            />
          </div>

          <Button onClick={handleCopyMessage} className="w-full" variant="secondary">
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? "Copied!" : "Copy Message to Clipboard"}
          </Button>

          <p className="text-xs text-slate-500">
            Please call or message the driver directly to confirm your booking.
          </p>
        </div>
      </Modal>
    </section>
  );
};

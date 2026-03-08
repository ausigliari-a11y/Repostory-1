import { useBooking } from '../../context/BookingContext';
import { VEHICLES } from '../../utils/mockData';
import { Button } from '../ui/Button';
import { Check, User, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';

export const VehicleList = () => {
  const { availableVehicles, selectedVehicle, setSelectedVehicle, priceData } = useBooking();

  // Filter vehicles based on available types (e.g. only vans for long distance)
  const displayedVehicles = VEHICLES.filter(v => availableVehicles.includes(v.type));

  if (displayedVehicles.length === 0) {
    return <div className="text-center text-slate-400 py-8">No vehicles available for this route.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {displayedVehicles.map((vehicle) => (
        <div 
          key={vehicle.id}
          className={clsx(
            "relative rounded-xl border-2 transition-all duration-300 overflow-hidden group cursor-pointer bg-navy-800",
            selectedVehicle?.id === vehicle.id 
              ? "border-gold-500 shadow-lg shadow-gold-500/20 transform -translate-y-1" 
              : "border-navy-700 hover:border-slate-500"
          )}
          onClick={() => setSelectedVehicle(vehicle)}
        >
          {selectedVehicle?.id === vehicle.id && (
            <div className="absolute top-2 right-2 z-10 bg-gold-500 text-navy-900 rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
          
          <div className="h-40 overflow-hidden relative">
            <img 
              src={vehicle.image} 
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent"></div>
          </div>
          
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-1">{vehicle.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{vehicle.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-slate-300 mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-gold-500" />
                <span>{vehicle.capacity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-gold-500" />
                <span>{vehicle.luggage}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-xs text-slate-400 block">Estimated Price</span>
                <span className="text-2xl font-bold text-white">€{priceData?.price}</span>
              </div>
              <Button 
                variant={selectedVehicle?.id === vehicle.id ? "primary" : "outline"}
                className="px-4 py-2 text-sm"
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

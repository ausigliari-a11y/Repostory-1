import { createContext, useContext, useState } from 'react';
import { calculatePrice, getAvailableVehicleTypes } from '../utils/pricingLogic';
import { getMockDistance } from '../utils/mockDistance';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookings, setBookings] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('ncc_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const calculateRoute = async (from, to) => {
    setLoadingDistance(true);
    setPickup(from);
    setDropoff(to);
    setSelectedVehicle(null);
    setPriceData(null);
    setDistance(null);

    try {
      const dist = await getMockDistance(from, to);
      setDistance(dist);

      const pricing = calculatePrice(dist);
      setPriceData(pricing);

      if (!pricing.error) {
        const vehicleTypes = getAvailableVehicleTypes(dist);
        setAvailableVehicles(vehicleTypes);
        setBookingStep(2);
      } else {
        // Handle error state (e.g., too far)
        setAvailableVehicles([]);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    } finally {
      setLoadingDistance(false);
    }
  };

  const addBooking = (booking) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      try {
        localStorage.setItem('ncc_bookings', JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };

  const deleteBooking = (id) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('ncc_bookings', JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };

  const updateBookingStatus = (id, status) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, status } : b
      );
      try {
        localStorage.setItem('ncc_bookings', JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };

  const updateBookingCustomerEmail = (id, email) => {
    setBookings((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, customerEmail: email } : b
      );
      try {
        localStorage.setItem('ncc_bookings', JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };

  const updateBookingRoute = async (id, from, to) => {
    try {
      const dist = await getMockDistance(from, to);
      const pricing = calculatePrice(dist);
      setBookings((prev) => {
        const next = prev.map((b) =>
          b.id === id
            ? {
                ...b,
                from,
                to,
                price: pricing.price,
              }
            : b
        );
        try {
          localStorage.setItem('ncc_bookings', JSON.stringify(next));
        } catch {
        }
        return next;
      });
    } catch (error) {
      console.error("Error updating booking route:", error);
    }
  };

  const resetBooking = () => {
    setPickup('');
    setDropoff('');
    setDistance(null);
    setPriceData(null);
    setSelectedVehicle(null);
    setBookingStep(1);
  };

  return (
    <BookingContext.Provider value={{
      pickup, setPickup,
      dropoff, setDropoff,
      distance,
      loadingDistance,
      priceData,
      availableVehicles,
      selectedVehicle,
      setSelectedVehicle,
      bookingStep,
      setBookingStep,
      bookings,
      addBooking,
      updateBookingStatus,
      updateBookingCustomerEmail,
      deleteBooking,
      updateBookingRoute,
      calculateRoute,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

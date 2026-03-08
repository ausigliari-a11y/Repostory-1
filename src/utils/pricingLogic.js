export const DEFAULT_PRICE_PER_KM = 2;
export const PRICE_PER_KM_STORAGE_KEY = 'ncc_price_per_km';

export const MAX_SERVICE_RADIUS_KM = 1400;

export const getPricePerKm = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_PRICE_PER_KM;
  }
  try {
    const stored = localStorage.getItem(PRICE_PER_KM_STORAGE_KEY);
    const value = stored ? parseFloat(stored) : NaN;
    if (!stored || Number.isNaN(value) || value <= 0) {
      return DEFAULT_PRICE_PER_KM;
    }
    return value;
  } catch {
    return DEFAULT_PRICE_PER_KM;
  }
};

export const setPricePerKm = (value) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(PRICE_PER_KM_STORAGE_KEY, String(value));
  } catch {
  }
};

/**
 * Calculates the price based on distance in KM.
 * @param {number} distanceKm 
 * @returns {object} { price: number, tier: object, error: string | null }
 */
export const calculatePrice = (distanceKm) => {
  if (distanceKm > MAX_SERVICE_RADIUS_KM) {
    return { 
      price: null, 
      tier: null, 
      error: "Destination out of service area (Max radius exceeded)." 
    };
  }

  const pricePerKm = getPricePerKm();
  const price = distanceKm * pricePerKm;

  return {
    price,
    tier: {
      label: `Tariffa ${pricePerKm}€/km`,
    },
    error: null
  };
};

/**
 * Determines available vehicle types based on distance.
 * @param {number} distanceKm 
 * @returns {string[]} Array of available vehicle types ('sedan', 'van')
 */
export const getAvailableVehicleTypes = (distanceKm) => {
  // Scenario B: Long Distance (Tier 4, 5, 6 -> >150km) -> VANS ONLY
  // Tier 3 ends at 150km. So > 150 is Tier 4+.
  if (distanceKm > 150) {
    return ['van'];
  }
  // Scenario A: Short/Medium -> ALL
  return ['sedan', 'wagon', 'van'];
};

import { findLocationCoordinates, calculateHaversineDistance } from './locations';

/**
 * Generates a distance based on real coordinates if available, 
 * or a deterministic "random" distance if not.
 * @param {string} from 
 * @param {string} to 
 * @returns {Promise<number>} distance in KM
 */
export const getMockDistance = async (from, to) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!from || !to) return 0;

  // 1. Try to find real coordinates
  const coordsFrom = findLocationCoordinates(from);
  const coordsTo = findLocationCoordinates(to);

  if (coordsFrom && coordsTo) {
    const straightLineKm = calculateHaversineDistance(coordsFrom, coordsTo);
    // Road distance is usually ~1.3x straight line distance
    const estimatedRoadKm = straightLineKm * 1.3;
    
    // Add a small random variance (+/- 5%) to make it look less "perfect" each time if desired,
    // but for stability we keep it fixed or round it.
    return Math.max(5, Math.floor(estimatedRoadKm));
  }

  // 2. Fallback: Hash function for unknown locations
  // We try to generate something somewhat plausible but it's just a guess.
  const combined = (from + to).toLowerCase().replace(/\s/g, '');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  
  const absHash = Math.abs(hash);
  // Default range 10km - 600km
  const distance = (absHash % 590) + 10; 
  
  return Math.floor(distance);
};

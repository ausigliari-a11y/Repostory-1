import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBooking } from '../../context/BookingContext';
import { LOCATIONS, findLocationCoordinates } from '../../utils/locations';

// Fix for default marker icon in Leaflet with Webpack/Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ pickup, dropoff }) => {
  const map = useMap();

  useEffect(() => {
    // Try to find exact coordinates first
    const pCoords = findLocationCoordinates(pickup);
    const dCoords = findLocationCoordinates(dropoff);

    if (pCoords) {
      map.flyTo(pCoords, 12);
    } else if (dCoords) {
      map.flyTo(dCoords, 12);
    }
  }, [pickup, dropoff, map]);

  return null;
};

export const MapComponent = () => {
  const { pickup, dropoff } = useBooking();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const newMarkers = [];
    const pCoords = findLocationCoordinates(pickup);
    const dCoords = findLocationCoordinates(dropoff);

    if (pCoords) newMarkers.push({ pos: pCoords, text: "Pickup: " + pickup });
    if (dCoords) newMarkers.push({ pos: dCoords, text: "Dropoff: " + dropoff });

    setMarkers(newMarkers);
  }, [pickup, dropoff]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-navy-700 shadow-xl">
      <MapContainer 
        center={[45.4642, 9.1900]} // Default Milan
        zoom={10} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater pickup={pickup} dropoff={dropoff} />
        
        {markers.map((m, i) => (
          <Marker key={i} position={m.pos}>
            <Popup>{m.text}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

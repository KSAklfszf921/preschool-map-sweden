import { useEffect, useRef, useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Preschool } from '@/types/preschool';
import { PreschoolCard } from './PreschoolCard';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom preschool marker
const createCustomMarker = (rating: number) => {
  const color = rating >= 4.5 ? '#22c55e' : rating >= 4.0 ? '#3b82f6' : '#f59e0b';
  
  return divIcon({
    html: `<div style="
      background: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: bold;
    ">${rating}</div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface MapContainerProps {
  preschools: Preschool[];
  selectedPreschool?: Preschool | null;
  onPreschoolSelect?: (preschool: Preschool) => void;
}

// Component to update map bounds when preschools change
const MapController = ({ preschools }: { preschools: Preschool[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (preschools.length > 0) {
      const bounds = preschools.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number]);
      if (bounds.length === 1) {
        map.setView(bounds[0], 13);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [preschools, map]);
  
  return null;
};

export const MapContainer = ({ preschools, selectedPreschool, onPreschoolSelect }: MapContainerProps) => {
  const mapRef = useRef(null);
  
  const defaultCenter: [number, number] = [59.3293, 18.0686]; // Stockholm
  const defaultZoom = 6;

  return (
    <div className="h-full w-full relative">
      <LeafletMapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        ref={mapRef}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController preschools={preschools} />
        
        {preschools.map((preschool) => (
          <Marker
            key={preschool.id}
            position={[preschool.coordinates.lat, preschool.coordinates.lng]}
            icon={createCustomMarker(preschool.rating)}
            eventHandlers={{
              click: () => onPreschoolSelect?.(preschool),
            }}
          >
            <Popup className="custom-popup" maxWidth={320}>
              <div className="p-1">
                <PreschoolCard 
                  preschool={preschool} 
                  onViewDetails={onPreschoolSelect}
                  className="shadow-none border-0 bg-transparent"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </div>
  );
};
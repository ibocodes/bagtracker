"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapViewProps = {
  center: [51.505, -0.09],
  zoom: 13,
  markerPosition: [51.505, -0.09],
  markerPopup: "Bag Location"
};

const defaultCenter = [51.505, -0.09];
const defaultZoom = 13;

export default function MapView({
  center = defaultCenter,
  zoom = defaultZoom,
  markerPosition = defaultCenter,
  markerPopup = "Bag Location",
}) {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (center && center[0] !== mapCenter[0] && center[1] !== mapCenter[1]) {
      setMapCenter(center);
      setMapZoom(zoom || 13);
    }
  }, [center, zoom, mapCenter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const safeCenter = mapCenter || defaultCenter;
  const safeMarkerPosition = markerPosition || defaultCenter;
  const safeZoom = mapZoom || defaultZoom;

  if (typeof window !== 'undefined' && !window.__leaflet_fallback) {
    window.__leaflet_fallback = () => {
      console.warn('Leaflet: switching to fallback tiles (if implemented).');
    };
  }

  return (
    <div className="h-[300px] sm:h-[400px] w-full my-4 sm:my-8 relative">
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <MapContainer
        key={`${safeCenter[0]}-${safeCenter[1]}`} // Force re-render when coordinates change
        center={safeCenter}
        zoom={safeZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        whenReady={() => setIsMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <Marker position={safeMarkerPosition}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{markerPopup}</div>
              <div className="text-sm text-gray-600 mt-1">
                {safeMarkerPosition[0].toFixed(4)}, {safeMarkerPosition[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
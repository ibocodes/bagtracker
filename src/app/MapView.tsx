"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define props for reusability
interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  markerPopup?: React.ReactNode;
}

const defaultCenter: [number, number] = [51.505, -0.09]; // London coordinates
const defaultZoom = 13;

export default function MapView({
  center = defaultCenter,
  zoom = defaultZoom,
  markerPosition = defaultCenter,
  markerPopup = "Bag Location",
}: MapViewProps) {
  return (
    <div className="h-[400px] w-full my-8">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition}>
          <Popup>{markerPopup}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
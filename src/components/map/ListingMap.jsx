import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass } from "lucide-react";

// Custom Airbnb-style Red Pin
const airbnbIcon = L.divIcon({
  className: "custom-airbnb-marker",
  html: `
    <div style="
      background-color: #ff385c;
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -20],
});

export default function ListingMap({ geometry, location, country, title }) {
  // GeoJSON coordinates are [longitude, latitude] -> Leaflet uses [latitude, longitude]
  const coordinates = geometry?.coordinates || [77.209, 28.6139];
  const position = [coordinates[1], coordinates[0]];

  return (
    <div className="pt-8 border-t border-gray-200 mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Where you&apos;ll be</h3>
      <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
        <Compass className="w-4 h-4 text-[#ff385c]" />
        {location}, {country}
      </p>

      <div className="h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Circle
            center={position}
            radius={800}
            pathOptions={{
              color: "#ff385c",
              fillColor: "#ff385c",
              fillOpacity: 0.15,
              weight: 1.5,
            }}
          />

          <Marker position={position} icon={airbnbIcon}>
            <Popup>
              <div className="p-1 text-center font-sans">
                <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                <p className="text-xs text-gray-500">
                  {location}, {country}
                </p>
                <span className="inline-block mt-1 text-[10px] text-[#ff385c] font-semibold">
                  Exact location provided after booking
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * Exact coordinates and directions are provided on your reservation confirmation.
      </p>
    </div>
  );
}

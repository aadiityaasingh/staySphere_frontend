import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to auto-fit map bounds around all visible listings
function MapBoundsUpdater({ listings }) {
  const map = useMap();
  useEffect(() => {
    if (listings && listings.length > 0) {
      const validPoints = listings
        .filter((l) => l.geometry?.coordinates?.length === 2)
        .map((l) => [l.geometry.coordinates[1], l.geometry.coordinates[0]]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [listings, map]);

  return null;
}

// Function to generate an Airbnb-style Price Pill marker
const createPriceMarker = (price) => {
  const formattedPrice = Number(price || 0).toLocaleString("en-IN");
  return L.divIcon({
    className: "price-pill-marker",
    html: `
      <div style="
        background: white;
        color: #222;
        font-weight: 700;
        font-size: 13px;
        padding: 5px 10px;
        border-radius: 20px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        border: 1px solid rgba(0,0,0,0.08);
        white-space: nowrap;
        cursor: pointer;
        transition: transform 0.15s ease-in-out, background 0.15s ease;
      " onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='#222'; this.style.color='white';" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='white'; this.style.color='#222';">
        &#8377;${formattedPrice}
      </div>
    `,
    iconSize: [60, 28],
    iconAnchor: [30, 14],
    popupAnchor: [0, -14],
  });
};

export default function ExploreMap({ listings }) {
  const defaultCenter = [20.5937, 78.9629]; // Default India center if empty

  return (
    <div className="h-[72vh] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater listings={listings} />

        {listings.map((listing) => {
          const coords = listing.geometry?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const pos = [coords[1], coords[0]];

          return (
            <Marker
              key={listing._id}
              position={pos}
              icon={createPriceMarker(listing.price)}
            >
              <Popup className="listing-map-popup" maxWidth={260}>
                <Link
                  to={`/listings/${listing._id}`}
                  className="block text-decoration-none group p-1"
                >
                  <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-gray-100 mb-2">
                    <img
                      src={
                        listing.image?.url ||
                        listing.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=400&q=60"
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {listing.location}, {listing.country}
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {listing.title}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    &#8377;{listing.price.toLocaleString("en-IN")}{" "}
                    <span className="font-normal text-xs text-gray-500">
                      / night
                    </span>
                  </p>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

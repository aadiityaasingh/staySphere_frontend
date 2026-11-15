import { useState, useEffect } from "react";
import {
  X,
  Wifi,
  Utensils,
  Wind,
  Briefcase,
  Car,
  Waves,
  PawPrint,
  Bath,
  Home,
  Check,
} from "lucide-react";

export const AMENITIES_LIST = [
  { id: "wifi", label: "Fast Wifi", icon: Wifi, desc: "High-speed internet access" },
  { id: "kitchen", label: "Kitchen", icon: Utensils, desc: "Space where guests can cook" },
  { id: "ac", label: "Air conditioning", icon: Wind, desc: "Climate control system" },
  { id: "workspace", label: "Dedicated workspace", icon: Briefcase, desc: "Desk & comfortable chair" },
  { id: "parking", label: "Free parking", icon: Car, desc: "On-premises vehicle parking" },
  { id: "pool", label: "Swimming pool", icon: Waves, desc: "Private or shared pool" },
  { id: "pets", label: "Pet friendly", icon: PawPrint, desc: "Assistance animals and pets allowed" },
  { id: "hottub", label: "Hot tub", icon: Bath, desc: "Relaxing private whirlpool" },
];

export const PROPERTY_TYPES = [
  { id: "any", label: "Any type", desc: "All property types" },
  { id: "entire_place", label: "Entire place", desc: "A place all to yourself" },
  { id: "private_room", label: "Room", desc: "Your own private room" },
  { id: "villa", label: "Luxury Villa", desc: "High-end standalone residence" },
  { id: "cabin", label: "Cabin", desc: "Rustic retreat in nature" },
];

export default function FilterModal({
  isOpen,
  onClose,
  initialFilters = {},
  onApplyFilters,
  onClearFilters,
  listingsCount,
}) {
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || "any");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || "");
  const [beds, setBeds] = useState(initialFilters.beds || "");
  const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms || "");
  const [selectedAmenities, setSelectedAmenities] = useState(
    Array.isArray(initialFilters.amenities)
      ? initialFilters.amenities
      : initialFilters.amenities
      ? initialFilters.amenities.split(",").filter(Boolean)
      : []
  );

  useEffect(() => {
    if (isOpen) {
      setPropertyType(initialFilters.propertyType || "any");
      setMinPrice(initialFilters.minPrice || "");
      setMaxPrice(initialFilters.maxPrice || "");
      setBedrooms(initialFilters.bedrooms || "");
      setBeds(initialFilters.beds || "");
      setBathrooms(initialFilters.bathrooms || "");
      setSelectedAmenities(
        Array.isArray(initialFilters.amenities)
          ? initialFilters.amenities
          : initialFilters.amenities
          ? initialFilters.amenities.split(",").filter(Boolean)
          : []
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      beds,
      bathrooms,
      amenities: selectedAmenities.join(","),
    });
    onClose();
  };

  const handleClear = () => {
    setPropertyType("any");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBeds("");
    setBathrooms("");
    setSelectedAmenities([]);
    onClearFilters();
    onClose();
  };

  // Count active filter adjustments
  const activeCount = [
    propertyType !== "any",
    Boolean(minPrice),
    Boolean(maxPrice),
    Boolean(bedrooms),
    Boolean(beds),
    Boolean(bathrooms),
    selectedAmenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-extrabold text-gray-900 text-base">Filters</h2>
          <div className="w-9" /> {/* Spacer for optical center */}
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-8 divide-y divide-gray-100">
          {/* Section 1: Type of Place */}
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Type of place</h3>
            <p className="text-xs text-gray-500 mb-4">
              Search rooms, entire homes, luxury villas or rustic cabins
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = propertyType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPropertyType(type.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">{type.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-black" />}
                    </div>
                    <span className="text-[11px] text-gray-500 line-clamp-1">{type.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Price Range */}
          <div className="pt-8">
            <h3 className="font-bold text-gray-900 text-base mb-1">Price range</h3>
            <p className="text-xs text-gray-500 mb-4">
              Nightly prices before taxes and fees
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Minimum (&#8377;)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm">&#8377;</span>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-3 py-2.5 text-sm font-semibold outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Maximum (&#8377;)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm">&#8377;</span>
                  <input
                    type="number"
                    placeholder="50000"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-3 py-2.5 text-sm font-semibold outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Rooms and Beds */}
          <div className="pt-8 space-y-5">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Rooms and beds</h3>
              <p className="text-xs text-gray-500 mb-4">
                Select minimum requirements for your stay
              </p>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Bedrooms</label>
              <div className="flex flex-wrap gap-2">
                {["", "1", "2", "3", "4", "5"].map((val) => (
                  <button
                    key={val || "any"}
                    type="button"
                    onClick={() => setBedrooms(val)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      bedrooms === val
                        ? "bg-black text-white"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-black"
                    }`}
                  >
                    {val === "" ? "Any" : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Beds */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Beds</label>
              <div className="flex flex-wrap gap-2">
                {["", "1", "2", "3", "4", "5"].map((val) => (
                  <button
                    key={val || "any"}
                    type="button"
                    onClick={() => setBeds(val)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      beds === val
                        ? "bg-black text-white"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-black"
                    }`}
                  >
                    {val === "" ? "Any" : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Bathrooms</label>
              <div className="flex flex-wrap gap-2">
                {["", "1", "2", "3", "4"].map((val) => (
                  <button
                    key={val || "any"}
                    type="button"
                    onClick={() => setBathrooms(val)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      bathrooms === val
                        ? "bg-black text-white"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-black"
                    }`}
                  >
                    {val === "" ? "Any" : `${val}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="pt-8">
            <h3 className="font-bold text-gray-900 text-base mb-1">Amenities</h3>
            <p className="text-xs text-gray-500 mb-4">
              Select key features you need for your trip
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AMENITIES_LIST.map((amenity) => {
                const Icon = amenity.icon;
                const isChecked = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isChecked
                        ? "border-black bg-gray-50 ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isChecked ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{amenity.label}</span>
                        {isChecked && <Check className="w-4 h-4 text-black shrink-0" />}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{amenity.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-gray-800 underline hover:text-black cursor-pointer transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-xl font-bold text-xs tracking-wide cursor-pointer transition-all shadow-md active:scale-98 flex items-center gap-2"
          >
            <span>Show stays</span>
            {activeCount > 0 && (
              <span className="bg-[#ff385c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
            {listingsCount !== undefined && listingsCount > 0 && (
              <span className="text-gray-300 font-normal">({listingsCount})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

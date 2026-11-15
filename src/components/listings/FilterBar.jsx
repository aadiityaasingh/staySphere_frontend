import { useState, useRef } from "react";
import FilterModal from "./FilterModal";
import {
  Flame,
  Bed,
  Building2,
  Mountain,
  Castle,
  Waves,
  Ship,
  Compass,
  Umbrella,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "All Stays", icon: Compass, desc: "Explore everywhere" },
  { id: "trending", label: "Trending", icon: Flame, desc: "Most popular" },
  { id: "beachfront", label: "Beachfront", icon: Umbrella, desc: "Right on the water" },
  { id: "iconic-cities", label: "Iconic Cities", icon: Building2, desc: "Urban lofts & skylines" },
  { id: "mountains", label: "Mountains", icon: Mountain, desc: "Cabins & ski chalets" },
  { id: "amazing-pools", label: "Amazing Pools", icon: Waves, desc: "Infinity & private pools" },
  { id: "castles", label: "Castles", icon: Castle, desc: "Historic villas & estates" },
  { id: "lakefront", label: "Lakefront", icon: Ship, desc: "Peaceful lake shores" },
  { id: "adventure", label: "Adventure", icon: Sparkles, desc: "Treehouses & safaris" },
  { id: "rooms", label: "Rooms", icon: Bed, desc: "Cozy rooms & flats" },
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  showTaxes,
  onToggleTaxes,
  filters = {},
  onApplyFilters,
  onClearFilters,
  listingsCount,
}) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const scrollRef = useRef(null);

  const activeFiltersCount = [
    filters.propertyType && filters.propertyType !== "any",
    Boolean(filters.minPrice),
    Boolean(filters.maxPrice),
    Boolean(filters.bedrooms),
    Boolean(filters.beds),
    Boolean(filters.bathrooms),
    Boolean(filters.amenities && filters.amenities.length > 0),
  ].filter(Boolean).length;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 pb-2 border-b border-gray-100 mb-6 select-none">
      {/* Category Horizontal Scroll with Arrow Controls */}
      <div className="relative flex-1 flex items-center overflow-hidden min-w-0">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-0 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer text-gray-700"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-7 overflow-x-auto no-scrollbar py-2 px-1 sm:px-9 scroll-smooth w-full"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 pb-2 cursor-pointer transition-all border-b-2 whitespace-nowrap shrink-0 group ${
                  isActive
                    ? "border-black text-black font-bold scale-105"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 font-medium"
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-transform group-hover:-translate-y-0.5 ${
                    isActive ? "text-black" : "text-gray-500 group-hover:text-black"
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-[12px] tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-0 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer text-gray-700"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right Controls: Filters Button + Tax Toggle */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto pb-2">
        {/* Filters Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          className={`flex items-center gap-2 py-2.5 px-4 border rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs ${
            activeFiltersCount > 0
              ? "border-black bg-black text-white"
              : "border-gray-200 hover:border-black text-gray-800 bg-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#ff385c] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Tax Toggle */}
        <div className="flex items-center gap-3 py-2 px-3.5 border border-gray-200 rounded-2xl shadow-xs bg-white">
          <label
            htmlFor="tax-switch"
            className="text-xs font-semibold text-gray-700 cursor-pointer select-none"
          >
            Display taxes
          </label>
          <button
            id="tax-switch"
            type="button"
            role="switch"
            aria-checked={showTaxes}
            onClick={onToggleTaxes}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showTaxes ? "bg-[#ff385c]" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showTaxes ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Airbnb Filters Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        initialFilters={filters}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        listingsCount={listingsCount}
      />
    </div>
  );
}

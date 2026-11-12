import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import FilterBar, { CATEGORIES } from "../components/listings/FilterBar";
import ListingCard from "../components/listings/ListingCard";
import ExploreMap from "../components/map/ExploreMap";
import {
  Compass,
  RefreshCw,
  Map as MapIcon,
  List as ListIcon,
  X,
} from "lucide-react";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaxes, setShowTaxes] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory && selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/listings", { params });
      if (res.data?.success) {
        setListings(res.data.listings || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, search, minPrice, maxPrice]);

  const handleSelectCategory = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  const handleApplyPriceFilter = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set("minPrice", min);
    else newParams.delete("minPrice");

    if (max) newParams.set("maxPrice", max);
    else newParams.delete("maxPrice");

    setSearchParams(newParams);
  };

  const currentCategoryObj =
    CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative min-h-[82vh]">
      {/* Category Pills & Filters */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        showTaxes={showTaxes}
        onToggleTaxes={() => setShowTaxes(!showTaxes)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onApplyPriceFilter={handleApplyPriceFilter}
      />

      {/* Dynamic Header & Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {search
              ? `Stays matching "${search}"`
              : currentCategoryObj.label}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {listings.length} place{listings.length === 1 ? "" : "s"} to stay &middot; {currentCategoryObj.desc}
          </p>
        </div>

        {/* Active Filter Chips */}
        {(search || selectedCategory !== "all" || minPrice || maxPrice) && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">
                Destination: {search}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("search");
                    setSearchParams(newParams);
                  }}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#ff385c] px-3 py-1 rounded-full font-semibold">
                {currentCategoryObj.label}
                <button
                  onClick={() => handleSelectCategory("all")}
                  className="hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">
                Price: &#8377;{minPrice || "0"} &ndash; &#8377;{maxPrice || "Any"}
                <button
                  onClick={() => handleApplyPriceFilter("", "")}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-[#ff385c] font-bold underline hover:text-[#e03150] cursor-pointer ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main View: Grid vs Interactive Map */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="aspect-[20/19] bg-gray-200 rounded-2xl w-full" />
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mt-2" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
              <div className="h-4 bg-gray-200 rounded-md w-1/3 mt-1" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-red-500 font-semibold mb-3">{error}</p>
          <button
            onClick={fetchListings}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-black cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto bg-gray-50/70 border border-gray-200 rounded-3xl p-8">
          <div className="w-16 h-16 bg-red-50 text-[#ff385c] rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No stays found</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            We couldn&apos;t find any properties matching this filter. Try exploring another category or clearing search parameters.
          </p>

          {/* Quick Category Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => handleSelectCategory("beachfront")}
              className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-black cursor-pointer"
            >
              Beachfront
            </button>
            <button
              onClick={() => handleSelectCategory("mountains")}
              className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-black cursor-pointer"
            >
              Mountains
            </button>
            <button
              onClick={() => handleSelectCategory("iconic-cities")}
              className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-black cursor-pointer"
            >
              Iconic Cities
            </button>
          </div>

          <button
            onClick={() => setSearchParams({})}
            className="bg-gray-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer shadow-md"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "map" ? (
        <ExploreMap listings={listings} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              showTaxes={showTaxes}
            />
          ))}
        </div>
      )}

      {/* Floating "Show Map / Show List" Toggle Pill */}
      {listings.length > 0 && !loading && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="flex items-center gap-2.5 bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 backdrop-blur-sm"
          >
            {viewMode === "list" ? (
              <>
                <span>Show map</span>
                <MapIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Show list</span>
                <ListIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

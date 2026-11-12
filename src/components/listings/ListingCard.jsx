import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ListingCard({ listing, showTaxes }) {
  const { user, toggleWishlist } = useAuth();

  const isLiked = user?.wishlist?.some(
    (w) => (typeof w === "string" ? w : w._id) === listing._id
  );

  const basePrice = listing.price || 0;
  const totalPrice = showTaxes ? Math.round(basePrice * 1.18) : basePrice;

  // Format rating
  const avgRating =
    listing.reviews && listing.reviews.length > 0
      ? (
          listing.reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
          listing.reviews.length
        ).toFixed(2)
      : null;

  // Generate a friendly category subtitle (e.g. "Beachfront stay", "Mountain views")
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "beachfront":
        return "Beachfront paradise";
      case "mountains":
        return "Mountain & slope views";
      case "lakefront":
        return "Serene lakefront";
      case "castles":
        return "Historic estate";
      case "amazing-pools":
        return "Luxury pool villa";
      case "iconic-cities":
        return "City skyline & loft";
      case "adventure":
        return "Nature & wilderness";
      case "rooms":
        return "Private room & stay";
      default:
        return "Popular stay";
    }
  };

  return (
    <div className="group flex flex-col relative select-none">
      <Link to={`/listings/${listing._id}`} className="block">
        {/* Image Container with Airbnb Aspect Ratio (20/19) */}
        <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-gray-100 mb-3 shadow-xs">
          <img
            src={
              listing.image?.url ||
              listing.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"
            }
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Category Pill on top left */}
          {listing.category && (
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              {listing.category}
            </span>
          )}

          {/* Heart / Favorite Button on top right */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await toggleWishlist(listing._id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full hover:scale-115 active:scale-90 transition-transform cursor-pointer"
          >
            <Heart
              className={`w-6 h-6 transition-all duration-200 ${
                isLiked
                  ? "fill-[#ff385c] text-[#ff385c] stroke-[#ff385c]"
                  : "text-white fill-black/30 stroke-white stroke-[2.2]"
              }`}
            />
          </button>
        </div>

        {/* Content Info */}
        <div className="flex items-start justify-between text-sm leading-tight">
          <h3 className="font-bold text-gray-900 truncate pr-2 tracking-tight">
            {listing.location}, {listing.country}
          </h3>
          <div className="flex items-center gap-1 shrink-0 font-medium text-gray-900">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span className="text-xs font-semibold">
              {avgRating ? Number(avgRating).toFixed(1) : "New"}
            </span>
          </div>
        </div>

        {/* Subtitle / Category Description */}
        <p className="text-xs text-gray-500 truncate mt-1">
          {getCategoryLabel(listing.category)} &middot; {listing.title}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-1 text-sm">
          <span className="font-extrabold text-gray-900 tracking-tight">
            &#8377;{totalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-500 font-normal text-xs">night</span>
          {showTaxes && (
            <span className="text-[11px] text-gray-400 font-normal ml-0.5">
              total before taxes
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

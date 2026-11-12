import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import ListingCard from "../components/listings/ListingCard";
import { Heart, Compass, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/wishlist");
        if (res.data?.success) {
          setWishlist(res.data.wishlist || []);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Wishlists</h1>
        <p className="text-sm text-gray-500">
          Your saved properties and dream stays in one place.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-16 h-16 bg-red-50 text-[#ff385c] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            As you search, click the heart icon on any stay to save your favorite places here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Stays</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((listing) => (
            <ListingCard key={listing._id} listing={listing} showTaxes={false} />
          ))}
        </div>
      )}
    </div>
  );
}

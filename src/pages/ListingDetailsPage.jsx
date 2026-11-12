import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import PhotoGallery from "../components/listings/PhotoGallery";
import ListingMap from "../components/map/ListingMap";
import BookingWidget from "../components/bookings/BookingWidget";
import {
  Star,
  MapPin,
  User,
  Edit3,
  Trash2,
  Share2,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/listings/${id}`);
      if (res.data?.success) {
        setListing(res.data.listing);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stay details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDeleteListing = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) {
      return;
    }
    try {
      const res = await api.delete(`/listings/${id}`);
      if (res.data?.success) {
        toast.success("Listing deleted successfully");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please add a review comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await api.post(`/listings/${id}/reviews`, {
        review: { rating, comment },
      });
      if (res.data?.success) {
        toast.success("Review posted!");
        setComment("");
        setRating(5);
        fetchListing();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await api.delete(`/listings/${id}/reviews/${reviewId}`);
      if (res.data?.success) {
        toast.success("Review deleted");
        fetchListing();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/2 mb-4" />
        <div className="h-96 bg-gray-200 rounded-3xl w-full mb-8" />
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || "This stay is unavailable."}</p>
        <Link
          to="/"
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-black"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isOwner = user && listing.owner && user._id === listing.owner._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Actions Bar */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#ff385c]" />
            <span>
              {listing.location}, {listing.country}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={() => toggleWishlist(listing._id)}
              className="inline-flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${
                  user?.wishlist?.some(
                    (w) => (typeof w === "string" ? w : w._id) === listing._id
                  )
                    ? "fill-[#ff385c] text-[#ff385c]"
                    : ""
                }`}
              />
              {user?.wishlist?.some(
                (w) => (typeof w === "string" ? w : w._id) === listing._id
              )
                ? "Saved"
                : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Signature Photo Gallery */}
      <PhotoGallery
        images={
          listing.images && listing.images.length > 0
            ? listing.images
            : listing.image
            ? [listing.image]
            : []
        }
        title={listing.title}
      />

      {/* Grid: Details Left + Reservation Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-gray-200">
        <div className="lg:col-span-2 space-y-6">
          {/* Host Info */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Hosted by {listing.owner?.username || "Superhost"}
              </h2>
              <p className="text-sm text-gray-500">Fast responder &middot; Highly rated stay</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {listing.owner?.username ? listing.owner.username.charAt(0).toUpperCase() : <User />}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4 pb-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-[#ff385c] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Enhanced Clean</h4>
                <p className="text-xs text-gray-500">This host committed to 5-step rigorous cleaning standards.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#ff385c] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Dedicated Workspace</h4>
                <p className="text-xs text-gray-500">Fast wifi and comfortable work area suitable for remote work.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About this place</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {listing.description}
            </p>
          </div>

          {/* Owner Action Buttons */}
          {isOwner && (
            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
              <Link
                to={`/listings/${listing._id}/edit`}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit Listing
              </Link>
              <button
                onClick={handleDeleteListing}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Listing
              </button>
            </div>
          )}
        </div>

        {/* Interactive Booking & Payment Engine */}
        <div>
          <BookingWidget listing={listing} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-12">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 fill-[#ff385c] text-[#ff385c]" />
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({listing.reviews?.length || 0})
          </h2>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 py-6 border-y border-gray-100 mb-8 text-sm">
          {[
            { label: "Cleanliness", score: "4.9" },
            { label: "Accuracy", score: "5.0" },
            { label: "Communication", score: "4.8" },
            { label: "Location", score: "5.0" },
            { label: "Check-in", score: "4.9" },
            { label: "Value", score: "4.8" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-gray-700">{item.label}</span>
              <div className="flex items-center gap-2.5">
                <div className="w-24 bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-gray-900 h-full rounded-full"
                    style={{ width: `${(parseFloat(item.score) / 5) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-xs text-gray-900 w-6 text-right">
                  {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a Review Form */}
        {user ? (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-gray-50 border border-gray-200 rounded-3xl p-6 max-w-xl mb-12 shadow-xs"
          >
            <h3 className="font-bold text-gray-900 text-lg mb-4">Leave a review</h3>

            {/* Star Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setRating(num)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        num <= rating
                          ? "fill-[#ff385c] text-[#ff385c]"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Comments
              </label>
              <textarea
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience staying here..."
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-[#ff385c]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-md mb-8 text-sm">
            Please{" "}
            <Link to="/login" className="text-[#ff385c] font-semibold underline">
              log in
            </Link>{" "}
            to leave a review for this property.
          </div>
        )}

        {/* Existing Reviews List */}
        {listing.reviews && listing.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listing.reviews.map((rev) => (
              <div
                key={rev._id}
                className="border border-gray-200 rounded-2xl p-5 shadow-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-xs">
                      {rev.author?.username ? rev.author.username.charAt(0).toUpperCase() : "G"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {rev.author?.username || "Guest"}
                      </h4>
                      <div className="flex items-center gap-0.5 text-xs text-[#ff385c]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {user && rev.author && user._id === rev.author._id && (
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No reviews yet for this stay.</p>
        )}

        {/* Location Map */}
        <ListingMap
          geometry={listing.geometry}
          location={listing.location}
          country={listing.country}
          title={listing.title}
        />
      </div>
    </div>
  );
}

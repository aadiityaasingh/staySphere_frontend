import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Compass,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function MyTripsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bookings/my");
        if (res.data?.success) {
          setBookings(res.data.bookings || []);
        }
      } catch (err) {
        toast.error("Failed to load your reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.post(`/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        toast.success("Reservation cancelled.");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "cancelled", paymentStatus: "refunded" } : b
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel reservation");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Trips</h1>
        <p className="text-sm text-gray-500">
          Manage your upcoming stays, reservations, and travel receipts.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-16 h-16 bg-red-50 text-[#ff385c] rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No trips booked... yet!</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Time to dust off your bags and start planning your next great adventure.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <span>Start Searching Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const listing = booking.listing;
            if (!listing) return null;

            return (
              <div
                key={booking._id}
                className={`border rounded-3xl p-6 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isCancelled
                    ? "bg-gray-50 border-gray-200 opacity-75"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                {/* Left: Image & Property Info */}
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="shrink-0 aspect-square w-24 sm:w-28 rounded-2xl overflow-hidden bg-gray-100 group"
                  >
                    <img
                      src={
                        listing.image?.url ||
                        listing.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=400&q=60"
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCancelled
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        #{booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <Link
                      to={`/listings/${listing._id}`}
                      className="text-base font-bold text-gray-900 hover:underline block leading-snug"
                    >
                      {listing.title}
                    </Link>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ff385c]" />
                      {listing.location}, {listing.country}
                    </p>
                  </div>
                </div>

                {/* Center: Dates & Guest Count */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-gray-600 border-t sm:border-t-0 pt-4 sm:pt-0 w-full md:w-auto">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-gray-400 block font-semibold text-[10px] uppercase">
                        Check-in &ndash; Checkout
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {new Date(booking.checkIn).toLocaleDateString()} &ndash;{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 block text-[11px]">
                        {booking.totalNights} nights &middot; {booking.guestsCount} guests
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 block font-semibold text-[10px] uppercase">
                      Total Cost
                    </span>
                    <span className="font-bold text-gray-900 text-base">
                      &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center w-full md:w-auto justify-end">
                  {!isCancelled && (
                    <button
                      type="button"
                      disabled={cancellingId === booking._id}
                      onClick={() => handleCancelBooking(booking._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {cancellingId === booking._id ? "Cancelling..." : "Cancel Trip"}
                    </button>
                  )}
                  <Link
                    to={`/listings/${listing._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl transition-colors"
                  >
                    View Stay
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

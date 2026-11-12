import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { CheckCircle2, Calendar, MapPin, Users, ArrowRight, Home } from "lucide-react";

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmBooking = async () => {
      if (!bookingId) {
        navigate("/");
        return;
      }
      try {
        const res = await api.post(`/bookings/${bookingId}/verify-payment`, {
          sessionId,
        });
        if (res.data?.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmBooking();
  }, [bookingId, sessionId, navigate]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 animate-pulse">
        <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-3" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reservation Confirmed!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          You&apos;re all set! A confirmation email and booking receipt have been generated.
        </p>

        {/* Booking Card Details */}
        {booking && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase block">
                  Reservation Code
                </span>
                <span className="font-mono font-bold text-gray-800 text-sm">
                  {booking._id.toUpperCase()}
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {booking.status}
              </span>
            </div>

            {/* Property Preview */}
            {booking.listing && (
              <div className="flex items-center gap-4 py-2">
                <img
                  src={
                    booking.listing.image?.url ||
                    booking.listing.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=400&q=60"
                  }
                  alt={booking.listing.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {booking.listing.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff385c]" />
                    {booking.listing.location}, {booking.listing.country}
                  </p>
                </div>
              </div>
            )}

            {/* Dates & Guests Grid */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">
                    Dates ({booking.totalNights} nights)
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Date(booking.checkIn).toLocaleDateString()} &ndash;{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">
                    Guests
                  </span>
                  <span className="font-medium text-gray-800">
                    {booking.guestsCount} guest{booking.guestsCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Total Paid</span>
              <span className="text-lg text-emerald-700">
                &#8377;{booking.totalPrice?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/trips"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e03150] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            <span>View My Trips</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Explore More Stays</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

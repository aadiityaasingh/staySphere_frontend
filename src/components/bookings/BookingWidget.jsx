import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Star, ShieldCheck, AlertCircle } from "lucide-react";

export default function BookingWidget({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to get formatted tomorrow / day after tomorrow
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getDayAfterTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getTomorrow());
  const [checkOut, setCheckOut] = useState(getDayAfterTomorrow());
  const [guestsCount, setGuestsCount] = useState(1);
  const [reservedDates, setReservedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conflictWarning, setConflictWarning] = useState("");

  const basePrice = listing.price || 0;

  // Fetch reserved dates for this listing
  useEffect(() => {
    const fetchReserved = async () => {
      try {
        const res = await api.get(`/bookings/listing/${listing._id}/reserved-dates`);
        if (res.data?.success) {
          setReservedDates(res.data.reservedDates || []);
        }
      } catch {
        // non-blocking
      }
    };
    if (listing?._id) {
      fetchReserved();
    }
  }, [listing._id]);

  // Check date collision locally whenever checkIn / checkOut changes
  useEffect(() => {
    if (!checkIn || !checkOut) return;
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      setConflictWarning("Check-out date must be after check-in.");
      return;
    }

    const hasConflict = reservedDates.some((r) => {
      const rStart = new Date(r.checkIn);
      const rEnd = new Date(r.checkOut);
      return start < rEnd && end > rStart;
    });

    if (hasConflict) {
      setConflictWarning("These dates are already reserved. Please choose different dates.");
    } else {
      setConflictWarning("");
    }
  }, [checkIn, checkOut, reservedDates]);

  // Calculations
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end - start;
  const totalNights =
    diffTime > 0 ? Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) : 0;

  const subtotal = totalNights * basePrice;
  const cleaningFee = 500;
  const serviceFee = Math.round(subtotal * 0.05);
  const taxes = Math.round((subtotal + cleaningFee + serviceFee) * 0.18);
  const totalPrice = subtotal + cleaningFee + serviceFee + taxes;

  const handleReserve = async () => {
    if (!user) {
      toast.error("Please log in to make a reservation");
      navigate("/login");
      return;
    }

    if (conflictWarning || totalNights <= 0) {
      toast.error(conflictWarning || "Please select valid check-in and check-out dates.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/bookings", {
        listingId: listing._id,
        checkIn,
        checkOut,
        guestsCount,
      });

      if (res.data?.success) {
        if (res.data.checkoutUrl) {
          toast.success("Redirecting to secure Stripe Checkout...");
          window.location.href = res.data.checkoutUrl;
        } else {
          toast.success("Reservation confirmed!");
          navigate(`/bookings/success?booking_id=${res.data.booking._id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900">
            &#8377;{basePrice.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Star className="w-4 h-4 fill-black text-black" />
          <span>
            {listing.reviews?.length > 0
              ? (
                  listing.reviews.reduce((a, b) => a + b.rating, 0) /
                  listing.reviews.length
                ).toFixed(1)
              : "New"}
          </span>
        </div>
      </div>

      {/* Date Pickers & Guests Card */}
      <div className="border border-gray-300 rounded-2xl overflow-hidden text-xs">
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-300 bg-white">
            <label className="font-bold uppercase text-gray-600 block text-[10px] mb-1">
              Check-in
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent font-medium text-gray-800 outline-none text-xs cursor-pointer"
            />
          </div>

          <div className="p-3 bg-white">
            <label className="font-bold uppercase text-gray-600 block text-[10px] mb-1">
              Checkout
            </label>
            <input
              type="date"
              min={checkIn || new Date().toISOString().split("T")[0]}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent font-medium text-gray-800 outline-none text-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Guest Stepper */}
        <div className="p-3 bg-white flex items-center justify-between">
          <div>
            <label className="font-bold uppercase text-gray-600 block text-[10px]">
              Guests
            </label>
            <span className="text-xs text-gray-800 font-medium">
              {guestsCount} guest{guestsCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={guestsCount <= 1}
              onClick={() => setGuestsCount((prev) => Math.max(1, prev - 1))}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 font-bold hover:border-black disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <span className="font-bold text-xs">{guestsCount}</span>
            <button
              type="button"
              disabled={guestsCount >= 10}
              onClick={() => setGuestsCount((prev) => prev + 1)}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 font-bold hover:border-black disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Collision Warning Banner */}
      {conflictWarning && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{conflictWarning}</span>
        </div>
      )}

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={loading || Boolean(conflictWarning) || totalNights <= 0}
        className="w-full bg-[#ff385c] hover:bg-[#e03150] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-md cursor-pointer disabled:opacity-50"
      >
        {loading ? "Processing..." : "Reserve Stay"}
      </button>

      <p className="text-center text-xs text-gray-400">
        You won&apos;t be charged until final confirmation
      </p>

      {/* Transparent Price Breakdown */}
      {totalNights > 0 && !conflictWarning && (
        <div className="pt-4 border-t border-gray-100 space-y-2.5 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="underline">
              &#8377;{basePrice.toLocaleString("en-IN")} &times; {totalNights} night{totalNights > 1 ? "s" : ""}
            </span>
            <span>&#8377;{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>&#8377;{cleaningFee.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline">StaySphere service fee</span>
            <span>&#8377;{serviceFee.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline">Taxes (18% GST)</span>
            <span>&#8377;{taxes.toLocaleString("en-IN")}</span>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base">
            <span>Total before taxes & fees included</span>
            <span>&#8377;{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>StayCover: Protection from host cancellations & booking guarantee.</span>
      </div>
    </div>
  );
}

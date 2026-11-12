import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Building2,
  DollarSign,
  CalendarCheck2,
  Star,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function HostDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    stats: {
      totalListings: 0,
      totalBookings: 0,
      totalRevenue: 0,
      avgRating: "5.0",
      totalReviews: 0,
    },
    listings: [],
    bookings: [],
  });
  const [activeTab, setActiveTab] = useState("listings"); // 'listings' | 'bookings'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchHostData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/dashboard");
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error("Failed to load host dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, [user, navigate]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) {
      return;
    }
    try {
      const res = await api.delete(`/listings/${listingId}`);
      if (res.data?.success) {
        toast.success("Listing deleted");
        setData((prev) => ({
          ...prev,
          listings: prev.listings.filter((l) => l._id !== listingId),
          stats: {
            ...prev.stats,
            totalListings: Math.max(0, prev.stats.totalListings - 1),
          },
        }));
      }
    } catch (err) {
      toast.error("Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, listings, bookings } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Host Hub &amp; Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, <strong>{user?.username}</strong>! Manage your properties and earnings.
          </p>
        </div>

        <Link
          to="/listings/new"
          className="inline-flex items-center gap-2 bg-[#ff385c] hover:bg-[#e03150] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Stay</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#ff385c] flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">
            Hosted Stays
          </span>
          <span className="text-3xl font-black text-gray-900">
            {stats.totalListings}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">
            Confirmed Bookings
          </span>
          <span className="text-3xl font-black text-gray-900">
            {stats.totalBookings}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">
            Total Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-black text-gray-900">
            &#8377;{stats.totalRevenue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">
            Rating ({stats.totalReviews} reviews)
          </span>
          <span className="text-3xl font-black text-gray-900">
            {stats.avgRating} <span className="text-sm font-normal text-gray-400">/ 5</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-8">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === "listings"
              ? "border-[#ff385c] text-[#ff385c]"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          My Properties ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === "bookings"
              ? "border-[#ff385c] text-[#ff385c]"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Guest Reservations ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTab === "listings" && (
        <div>
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                You haven&apos;t listed any properties yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Start earning by listing your apartment, villa, or spare room on StaySphere.
              </p>
              <Link
                to="/listings/new"
                className="bg-[#ff385c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-16/10 relative overflow-hidden bg-gray-100">
                    <img
                      src={
                        l.image?.url ||
                        l.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=600&q=60"
                      }
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-xs">
                      {l.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base mb-1 truncate">
                        {l.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#ff385c]" />
                        {l.location}, {l.country}
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        &#8377;{l.price?.toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          / night
                        </span>
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                      <Link
                        to={`/listings/${l._id}`}
                        className="inline-flex items-center gap-1 text-gray-700 hover:text-black"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      <Link
                        to={`/listings/${l._id}/edit`}
                        className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(l._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reservations Table */}
      {activeTab === "bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <CalendarCheck2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                No reservations received yet
              </h3>
              <p className="text-sm text-gray-500">
                When guests book your properties, their reservation details and payout will show here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-400 font-semibold text-[10px] uppercase border-b border-gray-200 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Property</th>
                      <th className="py-3.5 px-6">Guest</th>
                      <th className="py-3.5 px-6">Stay Dates</th>
                      <th className="py-3.5 px-6">Payout</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-gray-900 font-bold truncate max-w-xs">
                          {b.listing?.title || "Property"}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900 font-semibold">{b.guest?.username || "Guest"}</p>
                          <p className="text-xs text-gray-400">{b.guest?.email}</p>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-700">
                          {new Date(b.checkIn).toLocaleDateString()} &ndash;{" "}
                          {new Date(b.checkOut).toLocaleDateString()}
                          <span className="block text-gray-400 text-[10px]">
                            {b.totalNights} nights &middot; {b.guestsCount} guests
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-emerald-700">
                          &#8377;{b.totalPrice?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                              b.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

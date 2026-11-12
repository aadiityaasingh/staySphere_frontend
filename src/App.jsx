import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import NewListingPage from "./pages/NewListingPage";
import EditListingPage from "./pages/EditListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import MyTripsPage from "./pages/MyTripsPage";
import WishlistPage from "./pages/WishlistPage";
import HostDashboardPage from "./pages/HostDashboardPage";

function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <h1 className="text-6xl font-black text-[#ff385c] mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-6">
        The stay or page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-black"
      >
        Go back home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listings/:id" element={<ListingDetailsPage />} />
              <Route path="/listings/new" element={<NewListingPage />} />
              <Route path="/listings/:id/edit" element={<EditListingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/bookings/success" element={<BookingSuccessPage />} />
              <Route path="/trips" element={<MyTripsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/dashboard" element={<HostDashboardPage />} />
              <Route path="/host/dashboard" element={<HostDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

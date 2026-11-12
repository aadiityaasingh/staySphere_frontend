import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { CATEGORIES } from "../components/listings/FilterBar";
import { Upload, ArrowLeft, X, Images } from "lucide-react";

export default function NewListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "trending",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // If not logged in, prompt user
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Host on StaySphere</h2>
        <p className="text-sm text-gray-500 mb-6">You must be logged in to create a listing.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#ff385c] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#e03150] cursor-pointer"
        >
          Log in now
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const combinedFiles = [...imageFiles, ...files].slice(0, 10);
      setImageFiles(combinedFiles);
      setPreviewUrls(combinedFiles.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== indexToRemove);
    setImageFiles(updatedFiles);
    setPreviewUrls(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.location || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[location]", formData.location);
      data.append("listing[country]", formData.country);
      data.append("listing[category]", formData.category);

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const res = await api.post("/listings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Listing created successfully with photos!");
        navigate(`/listings/${res.data.listing._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Airbnb your home
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Fill in the details below to list your place on StaySphere.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Luxury Beachfront Villa with Infinity Pool"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Describe your place, views, amenities, and surroundings..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c] bg-white cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Multi-Image Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Property Photos (Up to 10)
              </label>
              <span className="text-xs text-gray-400">
                {imageFiles.length} / 10 selected
              </span>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer relative bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center py-3">
                <Images className="w-10 h-10 text-[#ff385c] mb-2" />
                <p className="text-sm font-semibold text-gray-800">
                  Click or drag photos to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, or WEBP. Upload at least 5 photos for the Airbnb photo grid!
                </p>
              </div>
            </div>

            {/* Thumbnail Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-xs"
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price, Location, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Price per night (&#8377;) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                required
                placeholder="2500"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                City / Location *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Goa, Jaipur"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Country *
              </label>
              <input
                type="text"
                name="country"
                required
                placeholder="e.g. India"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff385c] hover:bg-[#e03150] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Publishing listing with photos..." : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

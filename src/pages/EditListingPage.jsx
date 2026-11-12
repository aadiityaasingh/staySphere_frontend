import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { CATEGORIES } from "../components/listings/FilterBar";
import { ArrowLeft, Images, X } from "lucide-react";

export default function EditListingPage() {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        if (res.data?.success) {
          const l = res.data.listing;
          setFormData({
            title: l.title || "",
            description: l.description || "",
            price: l.price || "",
            location: l.location || "",
            country: l.country || "",
            category: l.category || "trending",
          });
          const photos = l.images?.length > 0 ? l.images : l.image ? [l.image] : [];
          setExistingImages(photos);
        }
      } catch (err) {
        toast.error("Failed to load listing for editing");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const combined = [...newImageFiles, ...files].slice(0, 10);
      setNewImageFiles(combined);
      setPreviewUrls(combined.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleRemoveNewImage = (idx) => {
    const updated = newImageFiles.filter((_, i) => i !== idx);
    setNewImageFiles(updated);
    setPreviewUrls(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[location]", formData.location);
      data.append("listing[country]", formData.country);
      data.append("listing[category]", formData.category);

      newImageFiles.forEach((file) => {
        data.append("images", file);
      });

      const res = await api.put(`/listings/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Listing updated successfully!");
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6" />
        <div className="h-64 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-black mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Stay
      </button>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Edit Listing Details
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Update the photos, pricing, or description for your property.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
            />
          </div>

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

          {/* Current Gallery */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Current Photos ({existingImages.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={img.url}
                      alt="Existing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Photos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Add More Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer relative bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImagesChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center py-2">
                <Images className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-700">
                  Click to select new photos
                </p>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={url}
                      alt="New preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Price (&#8377;) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                required
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
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#ff385c]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#ff385c] hover:bg-[#e03150] text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

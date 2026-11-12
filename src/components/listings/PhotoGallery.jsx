import { useState } from "react";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoGallery({ images = [], title }) {
  const [showModal, setShowModal] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Fallback if no images provided
  const photoList =
    images && images.length > 0
      ? images
      : [
          {
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=70",
            filename: "photo1",
          },
        ];

  const mainPhoto = photoList[0]?.url;
  const secondaryPhotos = photoList.slice(1, 5);

  return (
    <>
      {/* Signature Airbnb 5-Photo Grid */}
      <div className="relative mb-8">
        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-gray-100">
          {/* Main Hero Photo (Left 2 columns, full height) */}
          <div
            onClick={() => {
              setCurrentIdx(0);
              setShowModal(true);
            }}
            className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group"
          >
            <img
              src={mainPhoto}
              alt={`${title} - 1`}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
            />
          </div>

          {/* 4 Smaller Photos (Right 2 columns, 2x2) */}
          {secondaryPhotos.map((photo, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentIdx(i + 1);
                setShowModal(true);
              }}
              className="relative cursor-pointer overflow-hidden group"
            >
              <img
                src={photo.url}
                alt={`${title} - ${i + 2}`}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
              />
            </div>
          ))}

          {/* Fill empty slots if less than 5 photos */}
          {secondaryPhotos.length < 4 &&
            [...Array(4 - secondaryPhotos.length)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
              >
                StaySphere
              </div>
            ))}
        </div>

        {/* Mobile Single Photo */}
        <div
          onClick={() => setShowModal(true)}
          className="sm:hidden aspect-16/10 rounded-2xl overflow-hidden cursor-pointer"
        >
          <img
            src={mainPhoto}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* "Show all photos" Button */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md border border-gray-200 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer backdrop-blur-xs"
        >
          <Grid className="w-4 h-4" />
          Show all {photoList.length} photos
        </button>
      </div>

      {/* Full Screen Lightbox Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-gray-800">
            <span className="text-sm font-medium">
              {currentIdx + 1} / {photoList.length} &middot; {title}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo View */}
          <div className="flex-1 flex items-center justify-center relative max-h-[78vh]">
            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev === 0 ? photoList.length - 1 : prev - 1
                )
              }
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={photoList[currentIdx]?.url}
              alt={`${title} - full`}
              className="max-h-full max-w-full object-contain rounded-xl select-none"
            />

            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev === photoList.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {photoList.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer transition-opacity ${
                  idx === currentIdx
                    ? "border-white opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={p.url}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

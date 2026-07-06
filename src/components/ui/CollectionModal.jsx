import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

const CollectionModal = ({ isOpen, onClose, collection }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setActiveIndex(0);
  }, [isOpen, collection?.id]);

  if (!collection) return null;

  const gallery = collection.gallery || [];
  const totalSlides = gallery.length;

  const goNext = () => {
    if (!totalSlides) return;
    setActiveIndex(prev => (prev + 1) % totalSlides);
  };

  const goPrev = () => {
    if (!totalSlides) return;
    setActiveIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.35, ease: [0.17, 0.67, 0.3, 0.99] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       z-[101] w-[96%] max-w-5xl max-h-[92vh] overflow-y-auto
                       bg-black border border-white/12 rounded-[40px] p-8 md:p-10
                       shadow-[0_0_160px_rgba(0,0,0,1)] custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-7 right-7 p-2 rounded-full hover:bg-white/5 transition-colors z-50"
            >
              <X size={26} className="text-white/50" />
            </button>

            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-10 items-start">
              <div className="relative rounded-3xl overflow-hidden border border-white/12 bg-white/5">
                {totalSlides > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={gallery[activeIndex]}
                        src={gallery[activeIndex]}
                        alt={`${collection.name} ${activeIndex + 1}`}
                        className="w-full h-auto object-cover block"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>

                    <div className="absolute bottom-5 left-5">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20 text-[11px] uppercase tracking-[0.26em] text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        {collection.highlight}
                      </span>
                    </div>

                    {totalSlides > 1 && (
                      <div className="absolute bottom-5 right-5 flex items-center gap-2">
                        <button
                          onClick={goPrev}
                          className="w-9 h-9 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white hover:bg-black/85 transition-colors"
                        >
                          ‹
                        </button>
                        <button
                          onClick={goNext}
                          className="w-9 h-9 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white hover:bg-black/85 transition-colors"
                        >
                          ›
                        </button>
                      </div>
                    )}

                    {totalSlides > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {gallery.map((src, i) => (
                          <button
                            key={src}
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${i === activeIndex
                                ? "w-6 bg-white"
                                : "w-2 bg-white/40"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-56 flex items-center justify-center text-white/40 text-xs tracking-[0.3em] uppercase">
                    No images
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/45 mb-4">
                  Project Facts
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="rounded-2xl bg-white/4 border border-white/15 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/45 mb-1.5">
                      Property Type
                    </p>
                    <p className="text-sm md:text-base font-light text-white/95">
                      {collection.facts.type}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/4 border border-white/15 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/45 mb-1.5">
                      Plot Area
                    </p>
                    <p className="text-sm md:text-base font-light text-white/95">
                      {collection.facts.plot}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/4 border border-white/15 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/45 mb-1.5">
                      Total Units
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {collection.units}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/4 border border-white/15 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/45 mb-1.5">
                      Residential Floors
                    </p>
                    <p className="text-sm md:text-base font-medium text-white/95">
                      {collection.floors}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45 mb-2">
                    Architectural Composition
                  </p>
                  <p className="text-sm md:text-[15px] font-light text-white/80 leading-relaxed">
                    {collection.facts.levels}
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45 mb-3">
                    Unit Distribution
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(collection.facts.units).map(
                      ([key, val]) => {
                        const label = key
                          .replace("studio", "Studio")
                          .replace("bed1", "1 Bedroom")
                          .replace("bed2", "2 Bedroom")
                          .replace("bed3", "3 Bedroom")
                          .replace("bed4", "4 Bedroom")
                          .replace("bed5", "5 Bedroom")
                          .replace("shops", "Retail Shops");

                        return (
                          <div
                            key={key}
                            className="rounded-2xl bg-white/5 border border-white/16 px-3.5 py-3 flex flex-col gap-1"
                          >
                            <span className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                              {label}
                            </span>
                            <span className="text-xl font-semibold text-white">
                              {val}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      onClose();
                      const el = document.getElementById("inquiry");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 py-4 bg-white text-black rounded-2xl text-[11px] uppercase
                               tracking-[0.32em] font-bold hover:bg-gray-200 transition-all
                               shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                  >
                    Register Interest
                  </button>
                  <button
                    onClick={onClose}
                    className="px-8 py-4 bg-white/5 border border-white/18 text-white rounded-2xl
                               text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-white/10
                               transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollectionModal;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView
} from "framer-motion";
import {
  ShieldCheck,
  Car,
  Waves,
  Activity,
  Clock,
  Menu,
  X,
  ChevronRight,
  Phone,
  MessageCircle,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  Copy,
  Layers,
  Home,
  Maximize2
} from "lucide-react";
import "./App.css";

/* ----------------- Reusable components ----------------- */

const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0
      }}
      animate={
        isInView
          ? {
            opacity: 1,
            y: 0,
            x: 0
          }
          : {}
      }
      transition={{
        duration: 0.9,
        delay,
        ease: [0.19, 0.51, 0.23, 0.99]
      }}
    >
      {children}
    </motion.div>
  );
};

const SectionHeading = ({ subtitle, title, light = false }) => (
  <div className="mb-16 text-center">
    <motion.p
      initial={{ opacity: 0, letterSpacing: "0.12em", y: 10 }}
      whileInView={{ opacity: 1, letterSpacing: "0.42em", y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className={`text-xs uppercase font-light mb-4 ${light ? "text-[#D4AF37]/80" : "text-[#D4AF37]"
        }`}
    >
      {subtitle}
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
      className="text-3xl md:text-5xl font-extralight tracking-tight text-white"
    >
      {title}
    </motion.h2>
  </div>
);

const Notification = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    transition={{ duration: 0.25 }}
    className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl border backdrop-blur-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] min-w-[320px]
      ${type === "success"
        ? "bg-black/80 border-emerald-400/30 text-emerald-100"
        : "bg-black/80 border-red-500/40 text-red-200"
      }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="text-emerald-300" size={24} />
    ) : (
      <AlertCircle className="text-red-400" size={24} />
    )}
    <p className="text-sm font-light tracking-wide">{message}</p>
    <button
      onClick={onClose}
      className="ml-auto hover:opacity-60 transition-opacity"
    >
      <X size={18} />
    </button>
  </motion.div>
);

const PhoneModal = ({ isOpen, onClose, phone }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.17, 0.67, 0.3, 0.99] }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md bg-black border border-white/10 rounded-[40px] p-10 shadow-[0_0_120px_rgba(0,0,0,0.9)]"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={24} className="text-white/40" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
              <Phone size={32} className="text-white" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">
              Direct Contact
            </p>
            <h3 className="text-3xl font-light text-white mb-8 tracking-tight">
              {phone}
            </h3>
            <div className="grid grid-cols-2 gap-4 w-full">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl text-xs uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-all"
              >
                <Phone size={16} /> Call
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(phone);
                  alert("Copied!");
                }}
                className="flex items-center justify-center gap-3 py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-xs uppercase tracking-[0.3em] font-bold hover:bg-white/10 transition-all"
              >
                <Copy size={16} /> Copy
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* -------- Legal modal (Terms & Privacy) -------- */

const LegalModal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.3, ease: [0.17, 0.67, 0.3, 0.99] }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     z-[101] w-[96%] max-w-3xl max-h-[90vh] overflow-y-auto
                     bg-black border border-white/12 rounded-[32px] p-8 md:p-10
                     shadow-[0_0_120px_rgba(0,0,0,0.95)] custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={22} className="text-white/60" />
          </button>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/50 mb-2">
                Legal Information
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">
                {title}
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-white/80">
              {children}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* -------- Collection detail modal with slider -------- */

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
              {/* Left: gallery slider, title on top with black font */}
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

                    {/* <div className="absolute top-5 left-5 right-5 pointer-events-none">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-black mb-1.5">
                        {collection.tower}
                      </p>
                      <h3 className="text-2xl md:text-[26px] font-light text-black tracking-tight leading-snug">
                        {collection.name}
                      </h3>
                    </div> */}

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

              {/* Right: facts, units, CTAs */}
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

/* ----------------- Collections data ----------------- */

const collections = [
  {
    id: "wraith",
    name: "Binghatti Wraith",
    tower: "Main Tower",
    units: "Multiple",
    floors: "14 Residential",
    area: "Al Jaddaf District",
    image: `${import.meta.env.BASE_URL}hero1.avif`,
    highlight: "Contemporary Urban Living",
    facts: {
      type: "Residential & Retail",
      plot: "Al Jaddaf, Dubai",
      levels:
        "Ground Floor + 4 Podium Levels + 14 Residential Floors + Roof",
      units: {
        studio: "Available",
        bed1: "Available",
        bed2: "Available",
        bed3: "Available",
        shops: "Available"
      }
    },
    gallery: [
      `${import.meta.env.BASE_URL}hero1.avif`,
      `${import.meta.env.BASE_URL}hero2.avif`,
      `${import.meta.env.BASE_URL}hero3.avif`,
    ]
  }
];

/* ----------------- Main App ----------------- */

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [overviewImageIndex, setOverviewImageIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.85]);
  const heroScale = useTransform(scrollYProgress, [0, 0.05], [1, 1.05]);

  const contactInfo = {
    phone: "+34 625 76 60 08",
    whatsapp: "34625766008",
    email: "info@dprealestate.org",
    websites: ["www.dprealestate.org", "www.dprealestate.net"]
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOverviewImageIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const amenities = [
    { icon: <Waves size={20} />, label: "Infinity Pool & Jacuzzi" },
    { icon: <Activity size={20} />, label: "Spa & Wellness Area" },
    { icon: <Zap size={20} />, label: "Gym & Yoga Deck" },
    { icon: <Award size={20} />, label: "Padel & Basketball Court" },
    { icon: <Globe size={20} />, label: "Palm Promenade" },
    { icon: <Home size={20} />, label: "Family BBQ & Social Area" },
    { icon: <Layers size={20} />, label: "Children's Play Areas" },
    { icon: <Zap size={20} />, label: "EV Charging Stations" }
  ];

  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-white selection:text-black">
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <PhoneModal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        phone={contactInfo.phone}
      />

      <CollectionModal
        isOpen={!!selectedCollection}
        onClose={() => setSelectedCollection(null)}
        collection={selectedCollection}
      />

      {/* Legal modals */}
      <LegalModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        <p>
          These Terms of Service govern your use of this website and any services
          provided through it. By accessing or using the site, you agree to be
          bound by these terms in full.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">1. Provider details</h3>
        <p>
          This website is operated by DP Real Estate (the “Company”, “we”, “us”
          or “our”), established in the European Union. Our contact details are
          set out in the “Contact” section of this site.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">2. Use of the website</h3>
        <p>
          The website is provided for information purposes only. You may not use
          the site in any way that is unlawful, fraudulent, or likely to harm us,
          our partners, or other users.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          3. No offer, no advice
        </h3>
        <p>
          The content of this website does not constitute an offer, solicitation,
          or recommendation to buy or sell any property or financial product.
          Nothing on this site constitutes legal, tax, or investment advice.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">4. User submissions</h3>
        <p>
          When you submit information via forms, you confirm that all information
          is accurate and that you are authorised to provide it. You must not
          submit any content that is unlawful, offensive, or infringes
          third‑party rights.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">5. Intellectual property</h3>
        <p>
          All content on this website, including text, images, logos, and
          layouts, is protected by copyright and other intellectual property
          rights. You may view this content for personal use only. Any other use
          requires our prior written consent, unless permitted by mandatory law.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">6. Third‑party links</h3>
        <p>
          The site may contain links to third‑party websites. We have no control
          over and assume no responsibility for the content, privacy policies, or
          practices of third‑party websites.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">7. Liability</h3>
        <p>
          We take reasonable care to ensure that the information on this website
          is accurate and up to date. However, the site is provided “as is” and
          we make no warranties, express or implied, regarding its accuracy,
          completeness, or availability.
        </p>
        <p>
          To the maximum extent permitted by applicable law, we shall not be
          liable for any indirect, incidental, or consequential damages arising
          out of your use of, or inability to use, this website. Nothing in these
          terms excludes or limits liability where such exclusion or limitation
          would be unlawful under EU or local mandatory law.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          8. Data protection and privacy
        </h3>
        <p>
          We process personal data in accordance with the EU General Data
          Protection Regulation (GDPR) and applicable local laws. Details of how
          we collect and use personal data are set out in our Privacy Policy.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          9. Changes to the website and terms
        </h3>
        <p>
          We may update, suspend, or discontinue any part of the website at any
          time. We may also amend these Terms of Service from time to time. The
          version published on this site at the time of your visit applies.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">10. Governing law</h3>
        <p>
          These Terms of Service are governed by the laws of the Member State in
          which the Company is established, without prejudice to any mandatory
          consumer protection rules that apply in your country of residence
          within the European Economic Area.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">11. Contact</h3>
        <p>
          If you have any questions about these Terms of Service, please contact
          us using the details provided in the “Contact” section of this
          website.
        </p>
      </LegalModal>

      <LegalModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <p>
          This Privacy Policy explains how we collect and use personal data when
          you visit this website or contact us. We process personal data in
          accordance with the EU General Data Protection Regulation (GDPR) and
          applicable local data protection laws.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">1. Controller</h3>
        <p>
          The controller responsible for processing your personal data is DP
          Real Estate (the “Company”, “we”, “us” or “our”). Our contact details
          are available in the “Contact” section of this site.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          2. Personal data we collect
        </h3>
        <p>We may process the following categories of personal data:</p>
        <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
          <li>
            Identification and contact details (such as name, email address,
            phone number) when you submit an enquiry form or contact us
            directly.
          </li>
          <li>Communication data (content of messages and correspondence).</li>
          <li>
            Technical and usage data (such as IP address, browser type, device
            information, pages viewed and interaction data), collected via
            cookies or similar technologies.
          </li>
        </ul>
        <h3 className="text-sm font-semibold text-white mt-4">
          3. Purposes and legal bases
        </h3>
        <p>We process personal data for the following purposes:</p>
        <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
          <li>
            To respond to your enquiries and provide information about our
            projects and services (Art. 6(1)(b) or 6(1)(f) GDPR).
          </li>
          <li>
            To manage our relationship with you and maintain our records
            (Art. 6(1)(f) GDPR).
          </li>
          <li>
            To improve the website, ensure security, and compile statistics on
            usage (Art. 6(1)(f) GDPR).
          </li>
          <li>
            Where required, to send you marketing communications with your
            consent (Art. 6(1)(a) GDPR). You may withdraw consent at any time.
          </li>
        </ul>
        <h3 className="text-sm font-semibold text-white mt-4">
          4. Cookies and similar technologies
        </h3>
        <p>
          We may use cookies and similar technologies to operate the site,
          analyse usage, and remember your preferences. Where required by law, we
          will ask for your consent before setting non‑essential cookies. You can
          manage your cookie preferences via your browser settings or any cookie
          banner we provide.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          5. Recipients and transfers
        </h3>
        <p>
          We may share personal data with service providers that assist us in
          operating the website, managing enquiries, or providing IT services.
          These providers act as processors and are bound by contractual
          obligations to protect your data.
        </p>
        <p>
          Where data is transferred outside the European Economic Area, we will
          ensure appropriate safeguards are in place, such as standard
          contractual clauses approved by the European Commission, unless an
          adequacy decision or another lawful transfer mechanism applies.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          6. Retention period
        </h3>
        <p>
          We retain personal data only for as long as necessary for the purposes
          for which it was collected, or as required by applicable law. Enquiry
          data is generally kept for the duration of our correspondence and a
          reasonable period afterwards to handle follow‑up questions or legal
          claims.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          7. Your rights under GDPR
        </h3>
        <p>Subject to legal conditions, you have the following rights:</p>
        <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
          <li>Right of access to your personal data.</li>
          <li>Right to rectification of inaccurate or incomplete data.</li>
          <li>Right to erasure (“right to be forgotten”).</li>
          <li>Right to restriction of processing.</li>
          <li>Right to data portability.</li>
          <li>
            Right to object to processing based on our legitimate interests or
            for direct marketing.
          </li>
          <li>
            Where processing is based on consent, the right to withdraw consent
            at any time, without affecting the lawfulness of processing before
            withdrawal.
          </li>
        </ul>
        <p>
          To exercise your rights, please contact us using the details in the
          “Contact” section of this website. You also have the right to lodge a
          complaint with your local data protection authority.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          8. Security of your data
        </h3>
        <p>
          We take appropriate technical and organisational measures to protect
          personal data against unauthorised access, loss, alteration, or
          disclosure. However, no online system can be completely secure, and we
          cannot guarantee absolute security.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">
          9. Changes to this Privacy Policy
        </h3>
        <p>
          We may update this Privacy Policy from time to time, for example to
          reflect legal changes or new processing activities. The latest version
          will always be available on this website and will apply from the date
          of publication.
        </p>
        <h3 className="text-sm font-semibold text-white mt-4">10. Contact</h3>
        <p>
          If you have any questions about this Privacy Policy or our
          data‑protection practices, please contact us using the details
          provided in the “Contact” section of this website.
        </p>
      </LegalModal>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 0.51, 0.23, 0.99] }}
        className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden bg-white/5"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.jpg`}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-sm md:text-xl font-semibold tracking-[0.35em] uppercase">
                DP REAL ESTATE
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-white/50">
                Wraith | Al Jaddaf
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {["Overview", "Collections", "Amenities", "Location"].map(item => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-[11px] uppercase tracking-[0.3em] font-medium text-white/60 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("inquiry")}
              className="px-6 py-2.5 bg-white text-black text-[11px] uppercase tracking-[0.35em] font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.35)]"
            >
              Register Interest
            </button>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-black border-l border-white/10 p-6 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-[0.3em] uppercase text-white/50">
                  Menu
                </span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              {["Overview", "Collections", "Amenities", "Location", "inquiry"].map(
                item => (
                  <button
                    key={item}
                    onClick={() => {
                      scrollToSection(item.toLowerCase());
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm text-left uppercase tracking-[0.25em] text-white/70 hover:text-white py-2"
                  >
                    {item === "inquiry" ? "Register Interest" : item}
                  </button>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.19, 0.51, 0.23, 0.99] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={`${import.meta.env.BASE_URL}high.avif`}
            alt="Binghatti Wraith Hero"
            className="w-full h-full object-cover grayscale-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-black" />
        </motion.div>
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs md:text-sm uppercase tracking-[0.5em] text-white/80 mb-6 drop-shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          >
            Luxury Studios & Apartments in Al Jaddaf
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-5xl md:text-8xl font-extralight tracking-tight mb-8"
          >
            Binghatti <span className="text-[#D4AF37]">Wraith</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollToSection("overview")}
              className="px-10 py-4 bg-white text-black text-xs uppercase tracking-[0.35em] font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.35)]"
            >
              Experience Now
            </motion.button>
            <div className="flex flex-col items-center md:items-start gap-2 text-white">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/60" />
                <span className="text-xs uppercase tracking-[0.35em] text-white/90">
                  Al Jaddaf | Dubai
                </span>
                <div className="h-px w-12 bg-white/60" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/90">
                <span className="text-[#D4AF37] font-bold">Starting Price:</span> AED 799,999
                <span className="mx-2 text-white/40">|</span>
                Studio | 1 BR | 2 BR | 3 BR
              </div>
            </div>

          </motion.div>
        </div>
      </section>
      {/* Overview */}
      <section id="overview" className="py-32 px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn direction="right">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/15 bg-gradient-to-br from-white/5 to-black">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-700" />
              <AnimatePresence mode="wait">
                <motion.img
                  key={overviewImageIndex}
                  src={`${import.meta.env.BASE_URL}hero${overviewImageIndex + 1}.avif`}
                  alt={`Vision ${overviewImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: [0.19, 0.51, 0.23, 0.99] }}
                />
              </AnimatePresence>
            </div>
          </FadeIn>
          <div>
            <FadeIn delay={0.2}>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
                Urban Living Redefined
              </p>
              <h2 className="text-4xl md:text-6xl font-extralight mb-8 leading-tight">
                Why <br />
                <span className="text-white/40 italic">Binghatti Wraith?</span>
              </h2>
              <div className="space-y-6 text-gray-300 text-lg font-light leading-relaxed">
                <p>
                  Binghatti Wraith redefines contemporary urban living through its striking crystalline glass façades and panoramic vistas of Dubai’s most iconic landmarks, including Burj Khalifa, Dubai Frame, and the city’s skyline.
                </p>
                <p>
                  Strategically positioned in the heart of Al Jaddaf, it is just 6 minutes away from Downtown Dubai, offering seamless connectivity to DIFC, Dubai Healthcare City, and Dubai International Airport, while placing residents moments away from the cultural richness of the Mohammed Bin Rashid Library and Dubai Design District (D3).
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section
        id="collections"
        className="py-32 bg-white/[0.01] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            subtitle="Architectural Masterpieces"
            title="The Exclusive Collections"
          />
          <div className="flex flex-wrap justify-center gap-12">
            {collections.map((col, idx) => (
              <FadeIn key={col.id} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.35 }}
                  className="group relative bg-black border border-white/20 rounded-[40px] overflow-hidden transition-all duration-700 hover:border-white/50 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] w-full max-w-[600px]"
                >
                  <div className="absolute inset-0 z-0">
                    <motion.img
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 1.1 }}
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 grayscale-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/30" />
                  </div>

                  <div className="relative z-10 p-8 md:p-9 flex flex-col h-full min-h-[480px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/60 mb-1">
                          {col.tower}
                        </p>
                        <h3 className="text-2xl md:text-[26px] font-light tracking-tight leading-snug text-white">
                          {col.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedCollection(col)}
                        className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors group/btn"
                      >
                        <Maximize2
                          size={18}
                          className="text-white/60 group-hover/btn:text-white transition-colors"
                        />
                      </button>
                    </div>

                    <p className="inline-flex items-center gap-2 text-sm text-white/90 font-medium tracking-[0.22em] mb-8 border border-[#D4AF37]/30 rounded-full px-4 py-2 bg-[#D4AF37]/10 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      {col.highlight}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.26em] text-white/50">
                          Total Units
                        </p>
                        <p className="text-xl md:text-2xl font-semibold text-white">
                          {col.units}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.26em] text-white/50">
                          Residential Floors
                        </p>
                        <p className="text-sm md:text-base font-medium text-white/90">
                          {col.floors}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.26em] text-white/50">
                          Plot Area
                        </p>
                        <p className="text-sm md:text-base font-medium text-white/90">
                          {col.area}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/20">
                      <p className="text-xs uppercase tracking-[0.26em] text-white/50 mb-4">
                        Unit Mix
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(col.facts.units).map(([key, val]) => {
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
                              className="flex items-center justify-between bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5"
                            >
                              <span className="text-xs uppercase tracking-[0.18em] text-white/80">
                                {label}
                              </span>
                              <span className="text-sm font-semibold text-white">
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedCollection(col)}
                          className="flex-1 py-3 rounded-full bg-white text-black text-xs uppercase tracking-[0.26em] font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => scrollToSection("inquiry")}
                          className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-[0.26em] font-medium text-white/90 hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                          Inquire
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Exclusive Services"
            title="Engineered for Life"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform group-hover:text-white">
                    {item.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60 leading-tight">
                    {item.label}
                  </span>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* Location */}
      <section id="location" className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.03] -skew-x-12 translate-x-1/2 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <FadeIn>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
                  Al Jaddaf District
                </p>
                <h2 className="text-4xl md:text-5xl font-extralight mb-8 leading-tight">
                  Next In The <br />
                  <span className="text-white/40">City of Now</span>
                </h2>
                <p className="text-gray-400 text-lg font-light leading-relaxed mb-10">
                  Strategically positioned in the heart of Al Jaddaf, Binghatti Wraith offers seamless connectivity to Dubai's most iconic landmarks and business hubs, placing residents at the center of the city's creative and intellectual hubs.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    {
                      time: "6 Minutes",
                      place: "Downtown Dubai"
                    },
                    {
                      time: "8 Minutes",
                      place: "Dubai Intl Airport"
                    },
                    { time: "8 Minutes", place: "Zabeel Palace" },
                    { time: "10 Minutes", place: "DIFC" }
                  ].map((loc, idx) => (
                    <div
                      key={idx}
                      className="space-y-1 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock size={14} />{" "}
                        <span className="text-xs uppercase tracking-[0.28em]">
                          {loc.time}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{loc.place}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.3}>
              <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d137513.5444096678!2d55.31223936810359!3d25.08212905656814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f67b9e2599107%3A0x4a9e775524bcf3ec!2sMercedes-Benz%20Places%20%7C%20Binghatti%20City!5e0!3m2!1sen!2sae!4v1767957272068!5m2!1sen!2sae"
                  className="w-full h-full border-0 grayscale invert opacity-80"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            subtitle="Common Inquiries"
            title="Frequently Asked Questions"
          />
          <div className="space-y-4">
            {[
              {
                q: "What property types are available at Binghatti Wraith?",
                a: "Binghatti Wraith offers a diverse range of property types, including Studio, 1-bedroom, 2-bedroom, and 3-bedroom apartments, along with ground-floor retail spaces."
              },
              {
                q: "How many units and floors does Binghatti Wraith have?",
                a: "Binghatti Wraith comprises the ground floor, 4 Podium Levels, 14 Residential Floors, and a Roof."
              },
              {
                q: "Where is Binghatti Wraith located?",
                a: "Binghatti Wraith is strategically situated in Al-Jaddaf, offering close proximity to Downtown Dubai, Sheikh Zayed Road, Dubai Healthcare City, and Dubai International Airport."
              },
              {
                q: "How accessible is Binghatti Wraith to major roads and transport?",
                a: "Binghatti Wraith enjoys excellent connectivity to Dubai's major routes, including E11 (Sheikh Zayed Road), E44 (Al Khail Road), and Oud Metha. Residents also benefit from convenient access to the Metro, Uber, and taxi services."
              },
              {
                q: "What amenities does Binghatti Wraith offer?",
                a: "Binghatti Wraith offers an exceptional array of lifestyle and wellness amenities, including an Infinity Pool, Jacuzzi, Private Cabanas, Spa, Gym, Yoga Deck, Padel Court, Half Basketball Court, Palm Promenade, Landscaped Gardens, and EV Charging Stations."
              }
            ].map((faq, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <details className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                    <span className="text-sm md:text-base font-light text-white/90">{faq.q}</span>
                    <ChevronRight size={20} className="text-white/40 group-open:rotate-90 transition-transform duration-300" />
                  </summary>
                  <div className="px-6 pb-6 text-sm text-white/60 font-light leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* Inquiry */}
      <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}hero3.avif`}
            alt="Inquiry Background"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 relative z-10 overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.03)] backdrop-blur-sm">
          <div className="relative z-10">
            <SectionHeading
              subtitle="Secure Your Place"
              title="Inquire for Availability"
              light
            />
            <form
              className="grid md:grid-cols-2 gap-6"
              onSubmit={async e => {
                e.preventDefault();
                setIsSubmitting(true);

                const payload = Object.fromEntries(new FormData(e.target));

                try {
                  const response = await axios.post(
                    `${import.meta.env.BASE_URL}api/lead.php`,
                    payload,
                    {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  );

                  setNotification({
                    type: "success",
                    message:
                      response.data?.message || "Registered successfully."
                  });

                  e.target.reset();
                } catch (err) {
                  console.error(err);

                  setNotification({
                    type: "error",
                    message:
                      err.response?.data?.message ||
                      "Server error. Please try again."
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">
                  Full Name
                </label>
                <input
                  required
                  name="name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">
                  Email Address
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors"
                  placeholder={contactInfo.email}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">
                  Phone
                </label>
                <input
                  name="phone"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors"
                  placeholder={contactInfo.phone}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">
                  Preferred Unit
                </label>
                <select
                  name="unit"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 appearance-none"
                >
                  <option className="bg-black">Studio</option>
                  <option className="bg-black">1 Bedroom</option>
                  <option className="bg-black">2 Bedroom</option>
                  <option className="bg-black">3+ Bedroom</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-white/40 resize-none"
                  placeholder="How can we assist you?"
                />
              </div>
              <button
                disabled={isSubmitting}
                className="md:col-span-2 mt-4 py-5 bg-white text-black text-xs uppercase tracking-[0.4em] font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Submit Interest"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}logo.jpg`}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-[0.35em] uppercase leading-none mb-1">
                  DP REAL ESTATE
                </span>
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/40 leading-none">
                  Wraith | Al Jaddaf
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm max-w-sm font-light">
              A masterpiece of contemporary urban living in the heart of Al Jaddaf, 
              Binghatti Wraith brings architectural excellence and unmatched 
              luxury to Dubai's most dynamic creative district.
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <Mail size={16} /> <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} /> <span>{contactInfo.phone}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setPhoneModalOpen(true)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <Phone size={18} />
              </button>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-6">
              Official Websites
            </h4>
            <ul className="space-y-3 text-sm text-gray-500 font-light">
              {contactInfo.websites.map(site => (
                <li key={site}>
                  <a
                    href={`https://${site}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Globe size={14} /> {site}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:ml-auto flex flex-col gap-6 text-right">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                Location
              </span>
              <span className="text-sm font-light text-white/80">
                Nad Al Sheba, Dubai
              </span>
            </div>
            <button
              onClick={() => scrollToSection("inquiry")}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Register Interest
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-gray-600">
          <span>© 2026 DP Real Estate. All rights reserved.</span>
          <div className="flex gap-8">
            <button
              onClick={() => setShowPrivacy(true)}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* Fixed contact icons */}
      <div className="fixed bottom-10 right-10 z-40 flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPhoneModalOpen(true)}
          className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl"
        >
          <Phone size={24} />
        </motion.button>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://wa.me/${contactInfo.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <MessageCircle size={24} />
        </motion.a>
      </div>
    </div>
  );
}
// src/App.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";

export default function App() {
  const [featureData, setFeatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollDir, setScrollDir] = useState("up");
  const [ctaInView, setCtaInView] = useState(false);
  const [activeTab, setActiveTab] = useState("location");

  const ctaRef = useRef(null);
  const designRef = useRef(null);
  const [designInView, setDesignInView] = useState(false);

  // Fetch features from Netlify function
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const res = await axios.get("/.netlify/functions/features");
        setFeatureData(res.data);
      } catch (err) {
        console.error("Failed to fetch features:", err);
        setError(err);
        setFeatureData([
          { title: "Iconic Tower", text: "Signature skyscraper inspired by Mercedes‑Benz design." },
          { title: "Central Park", text: "12 curated experiences surrounded by greenery." },
          { title: "Premium Facilities", text: "Spa, gym, pools, and concierge service." },
          {
            title: "Location Advantages",
            text: "Minutes from Dubai International Airport, Dubai Mall & Business Bay."
          },
          { title: "Payment Plan", text: "20% down, 50% during construction, 30% on completion." }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // Detect scroll direction to hide/show nav
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY + 5) {
        setScrollDir("down");
      } else if (currentY < lastY - 5) {
        setScrollDir("up");
      }
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Observe CTA section entering viewport
  useEffect(() => {
    if (!ctaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  // Observe Design section for subtle reveal
  useEffect(() => {
    if (!designRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDesignInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(designRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ===== Fixed Contacts (bottom-right) ===== */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-300 mb-2">
            Contact
          </p>
          <p className="text-sm font-medium">+971 4 123 4567</p>
          <p className="text-sm font-medium">info@mercedesplaces.com</p>
          <button
            className="mt-3 w-full text-xs font-semibold tracking-[0.2em] border border-white/40 rounded-full px-3 py-1.5
                       hover:bg-white hover:text-black transition"
          >
            WhatsApp Us
          </button>
        </div>
      </div>

      {/* ===== HERO WITH BACKGROUND VIDEO ===== */}
      <div className="relative h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/high.mp4"  // your hero video
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* Nav */}
        <header
          className={`sticky top-0 z-30 transition-transform duration-500 will-change-transform
                      ${scrollDir === "down" ? "-translate-y-full" : "translate-y-0"}`}
        >
          <div className="px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full border border-white/40 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border border-white/70" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.35em] uppercase text-gray-300">
                  Mercedes‑Benz
                </span>
                <span className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase">
                  Places | Binghatti
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center space-x-8 text-[11px] tracking-[0.28em] uppercase">
              <a href="#overview" className="hover:text-gray-300">Overview</a>
              <a href="#residences" className="hover:text-gray-300">Residences</a>
              <a href="#design" className="hover:text-gray-300">Design</a>
              <a href="#tabs" className="hover:text-gray-300">Location & Plans</a>
              <a href="#faq" className="hover:text-gray-300">FAQ</a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                className="hidden md:inline-flex items-center tracking-[0.28em] text-[11px] uppercase
                           border border-white/70 rounded-full px-4 py-2
                           hover:bg-white hover:text-black transition"
              >
                Register Your Interest
              </button>
              <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-full border border-white/40">
                <span className="sr-only">Open menu</span>
                <div className="space-y-1.5">
                  <span className="block h-[2px] w-5 bg-white" />
                  <span className="block h-[2px] w-5 bg-white" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative z-10 h-full flex items-end pb-20">
          <div className="w-full px-6 md:px-16 lg:px-24 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            {/* Left */}
            <div className="max-w-xl">
              <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-gray-300 mb-4">
                Introducing
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
                Mercedes‑Benz<br className="hidden md:block" />
                Places <span className="text-gray-300">| Dubai</span>
              </h1>
              <p className="text-sm md:text-base text-gray-200/90 max-w-md mb-6">
                A master‑planned community shaped by Mercedes‑Benz DNA – precision
                engineering, sensual purity, and timeless architecture overlooking the Dubai skyline.[file:108]
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center tracking-[0.28em] text-[11px] uppercase
                             bg-white text-black rounded-full px-5 py-2
                             hover:bg-gray-200 transition"
                >
                  Register Your Interest
                </button>
                <button
                  className="inline-flex items-center tracking-[0.28em] text-[11px] uppercase
                             border border-white/60 rounded-full px-4 py-2
                             hover:bg-white hover:text-black transition"
                >
                  Explore Residences
                </button>
              </div>
            </div>

            {/* Right stats */}
            <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
              <StatCard label="From" value="AED 1.35M" sub="Studios" />
              <StatCard label="Views" value="Burj Khalifa" sub="Skyline" />
              <StatCard label="Completion" value="2027" sub="Target" />
              <StatCard label="Payment" value="20 / 50 / 30" sub="Plan" />
            </div>
          </div>
        </section>
      </div>

      {/* ===== Key Highlights ===== */}
      <section id="overview" className="py-16 px-6 bg-black">
        <h2 className="text-2xl font-semibold mb-8 text-center tracking-[0.25em] uppercase">
          Key Highlights
        </h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {featureData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-sm hover:bg-white/10 transition"
              >
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        )}
        {error && (
          <p className="mt-4 text-center text-red-400">
            Unable to load features – showing fallback data.
          </p>
        )}
      </section>

      {/* ===== Available Residences (inspired by their cards) ===== */}
      <section id="residences" className="py-16 px-6 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-[0.25em] uppercase">
              Available Residences
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Curated Selection
            </p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-[640px]">
              <UnitCard
                label="Studio"
                price="1,350,000"
                size="362 sqft"
                image="/residences/studio.jpg"
              />
              <UnitCard
                label="1 Bedroom"
                price="2,303,000"
                size="632 sqft"
                image="/residences/1br.jpg"
              />
              <UnitCard
                label="2 Bedroom"
                price="3,242,000"
                size="992 sqft"
                image="/residences/2br.jpg"
              />
              <UnitCard
                label="3 Bedroom"
                price="4,950,000"
                size="1321 sqft"
                image="/residences/3br.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Design Philosophy Section (Concept / Intricate / Complexity) ===== */}
      <section
        id="design"
        ref={designRef}
        className="py-20 px-6 bg-black border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-3">
              Design Philosophy
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-3">
              Precision. Elegance. Sensual Purity.
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto">
              Inspired by Mercedes‑Benz design principles, the masterplan balances sculpted
              silhouettes with rational grids, creating a city that feels both engineered
              and emotional.[file:108]
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <DesignCard
              inView={designInView}
              delay={0}
              title="Urban Vision"
              subtitle="A new city silhouette"
              text="An urban composition defined by disciplined lines, layered terraces and calibrated proportions that create a distinctive skyline."
            />
            <DesignCard
              inView={designInView}
              delay={150}
              title="Luxury Geometry"
              subtitle="Contrast & light"
              text="Geometry inspired by automotive forms – surfaces that catch the light, edges that emphasize motion, and voids that frame the city."
            />
            <DesignCard
              inView={designInView}
              delay={300}
              title="Intelligent Living"
              subtitle="Engineered for life"
              text="Every square meter is considered, integrating smart systems and intuitive layouts that respond to modern metropolitan living."
            />
          </div>
        </div>
      </section>

      {/* ===== Location / Gallery / Floor Plans / Brochure Tabs ===== */}
      <section
        id="tabs"
        className="py-20 px-6 bg-black border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          {/* Tab headers */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { id: "location", label: "Location" },
              { id: "gallery", label: "Gallery" },
              { id: "floorplans", label: "Floor Plans" },
              { id: "brochure", label: "Brochure" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs tracking-[0.3em] uppercase border rounded-full transition
                            ${
                              activeTab === tab.id
                                ? "bg-white text-black border-white"
                                : "bg-black text-gray-300 border-white/40 hover:border-white"
                            }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
            {activeTab === "location" && (
              <div className="p-6 md:p-8 space-y-4 animate-fade-in">
                <h3 className="text-lg tracking-[0.2em] uppercase mb-2">
                  Meydan, Nad Al Sheba
                </h3>
                <p className="text-sm text-gray-300 max-w-2xl">
                  Strategically located in Meydan, Dubai – minutes from Dubai International Airport,
                  Downtown Dubai, Business Bay, Dubai Design District, and Ras Al Khor Wildlife Sanctuary.[file:108]
                </p>
                <ul className="text-sm text-gray-300 grid md:grid-cols-2 gap-1 mt-2">
                  <li>Dubai International Airport – 15 minutes</li>
                  <li>Dubai Mall – 10 minutes</li>
                  <li>Business Bay – 10 minutes</li>
                  <li>Dubai Design District – 8 minutes</li>
                  <li>Ras Al Khor Wildlife Sanctuary – 5 minutes</li>
                </ul>
                <div className="mt-6 h-64 md:h-80 w-full rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    title="Mercedes‑Benz Places Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d137513.5444096678!2d55.31223936810359!3d25.08212905656814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f67b9e2599107%3A0x4a9e775524bcf3ec!2sMercedes-Benz%20Places%20%7C%20Binghatti%20City!5e0!3m2!1sen!2sae!4v1767957272068!5m2!1sen!2sae"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="p-6 md:p-8 animate-fade-in">
                <p className="text-sm text-gray-300 mb-4">
                  A curated glimpse into residences, lobbies, and exteriors. Replace the placeholders
                  with your own images when ready.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {["exterior-1.jpg", "lobby-1.jpg", "living-1.jpg"].map((img, i) => (
                    <div
                      key={img}
                      className="relative h-40 md:h-52 lg:h-64 bg-white/10 overflow-hidden rounded-xl group"
                    >
                      <div
                        className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(/gallery/${img})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-xs tracking-[0.25em] uppercase">
                        {i === 0 ? "Exterior" : i === 1 ? "Lobby" : "Living Space"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "floorplans" && (
              <div className="p-6 md:p-8 space-y-4 animate-fade-in">
                <p className="text-sm text-gray-300 mb-2">
                  Explore a selection of floor plans across Project Maybach, Ultimate Luxury and Vision Maybach collections.[file:108]
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="border border-white/10 rounded-xl p-4 bg-black/60">
                    <p className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-1">
                      Project Maybach
                    </p>
                    <p>Studios, 1–3 Bedroom residences with efficient layouts and panoramic glazing.</p>
                  </div>
                  <div className="border border-white/10 rounded-xl p-4 bg-black/60">
                    <p className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-1">
                      Ultimate Luxury
                    </p>
                    <p>Elevated floor plates, expansive terraces and corner units with dual‑aspect views.</p>
                  </div>
                  <div className="border border-white/10 rounded-xl p-4 bg-black/60">
                    <p className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-1">
                      Vision Maybach 6
                    </p>
                    <p>Signature layouts inspired by concept vehicles, designed for statement living.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "brochure" && (
              <div className="p-6 md:p-8 space-y-4 animate-fade-in text-center">
                <p className="text-sm text-gray-300 max-w-2xl mx-auto mb-4">
                  Download the full brochure for Mercedes‑Benz Places Binghatti City, including
                  project facts, floor plans, and curated imagery.[file:108]
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs tracking-[0.3em] uppercase hover:bg-gray-200 transition"
                >
                  Download Brochure
                  <span className="text-[10px]">PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CTA section with scroll-triggered animation ===== */}
      <section
        ref={ctaRef}
        className={`
          relative overflow-hidden py-20 px-6 md:px-16 lg:px-24
          bg-black border-t border-white/5
          transition-transform duration-[1200ms] ease-out
          ${ctaInView ? "scale-100" : "scale-95"}
        `}
      >
        <div
          className={`
            absolute inset-0 -z-10
            bg-[radial-gradient(circle_at_top,_#ffffff12,_#000000)]
            transition-transform duration-[1200ms] ease-out
            ${ctaInView ? "scale-110" : "scale-100"}
          `}
        />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.25em] uppercase mb-4">
              Register Your Interest
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
              Share your details to receive a tailored presentation, payment plan and
              availability for Mercedes‑Benz Places Binghatti City.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left description */}
            <div
              className={`
                transition-all duration-[900ms] ease-out
                ${ctaInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
              `}
            >
              <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                <h3 className="text-lg font-medium mb-3 tracking-[0.2em] uppercase">
                  Exclusive Residences
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Studios to 5‑bedroom residences and penthouses, crafted with the
                  design language of Mercedes‑Benz – from lobby arrival to private terraces.[file:108]
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Flexible 20 / 50 / 30 payment plan</li>
                  <li>• Central park with 12 curated experiences</li>
                  <li>• 12‑tower community anchored by an iconic signature tower</li>
                </ul>
              </div>
            </div>

            {/* Right form */}
            <div
              className={`
                transition-all duration-[900ms] ease-out
                ${ctaInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
              `}
            >
              <form
                className="border border-white/10 rounded-2xl p-6 bg-black/60 backdrop-blur-md space-y-4"
                onSubmit={async e => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const payload = Object.fromEntries(formData);
                  try {
                    await axios.post("/.netlify/functions/lead", payload);
                    alert("Thank you! We’ll contact you shortly.");
                    e.target.reset();
                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong – please try again.");
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Full Name" name="name" type="text" required />
                  <InputField label="Email" name="email" type="email" required />
                  <InputField label="Phone" name="phone" type="tel" />
                  <InputField label="City" name="city" type="text" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded
                               text-sm text-white resize-none focus:outline-none focus:border-white"
                    placeholder="Tell us what you’re interested in (residence type, budget, timeline)…"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 bg-white text-black text-xs font-semibold
                             tracking-[0.28em] uppercase rounded-full hover:bg-gray-200 transition"
                >
                  Submit Details
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ (inspired by their questions) ===== */}
      <section
        id="faq"
        className="py-20 px-6 bg-black border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center mb-6 tracking-[0.25em] uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-300 text-center mb-8">
            Answers to the most common questions about Mercedes‑Benz Places Binghatti City.[file:108]
          </p>

          <div className="space-y-3">
            <FaqItem
              question="What types of properties are available?"
              answer="Mercedes‑Benz Places Binghatti City offers a range of residences, from studios to 5‑bedroom apartments."
            />
            <FaqItem
              question="How many towers are in the community?"
              answer="The masterplan features 12 towers, including a signature iconic tower and a central park with 12 curated experiences."
            />
            <FaqItem
              question="What is the payment plan?"
              answer="A structured 20 / 50 / 30 payment plan: 20% down payment, 50% during construction, 30% upon completion."
            />
            <FaqItem
              question="Why is this a strong investment opportunity?"
              answer="It combines a global brand, architectural excellence, prime location in Meydan and a rich amenity offering, creating long‑term value."
            />
            <FaqItem
              question="Where is Mercedes‑Benz Places Binghatti City located?"
              answer="In Meydan, Dubai – within minutes of Dubai International Airport, Dubai Mall, Business Bay, Dubai Design District and Ras Al Khor Wildlife Sanctuary."
            />
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10 py-6 text-center text-gray-500 bg-black">
        <p>© {new Date().getFullYear()} Mercedes‑Benz Places Binghatti City. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ---------- Small reusable components ---------- */

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
      <p className="uppercase tracking-[0.3em] text-gray-300 mb-1 text-[11px]">
        {label}
      </p>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

function UnitCard({ label, price, size, image }) {
  return (
    <div className="min-w-[260px] max-w-xs bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-shrink-0">
      <div className="h-40 bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover transition-transform duration-700 hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute bottom-3 left-4 text-xs tracking-[0.25em] uppercase">
          {label}
        </span>
      </div>
      <div className="p-4 space-y-1 text-sm">
        <p className="flex items-center justify-between text-gray-300">
          <span>Starting from</span>
          <span className="font-medium">AED {price}</span>
        </p>
        <p className="flex items-center justify-between text-gray-400 text-xs">
          <span>Area</span>
          <span>{size}</span>
        </p>
        <button
          className="mt-3 w-full text-xs tracking-[0.25em] uppercase border border-white/60 rounded-full px-3 py-2 hover:bg-white hover:text-black transition"
        >
          View Residence
        </button>
      </div>
    </div>
  );
}

function DesignCard({ inView, delay, title, subtitle, text }) {
  return (
    <div
      className={`
        border border-white/10 rounded-2xl p-6 bg-black/70 backdrop-blur-md
        transition-all duration-[900ms] ease-out
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-2">
        {subtitle}
      </p>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}

function InputField({ label, name, type, required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="w-full px-3 py-2 bg-black border border-white/20 rounded
                   text-sm text-white focus:outline-none focus:border-white"
        required={required}
      />
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60">
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm md:text-base">{question}</span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-300 border-t border-white/10">
          {answer}
        </div>
      )}
    </div>
  );
}
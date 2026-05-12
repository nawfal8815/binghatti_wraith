import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  ShieldCheck,
  Car,
  Waves,
  Activity,
  Clock,
  Menu,
  X,
  ChevronRight,
  Download,
  Phone,
  MessageCircle,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  ExternalLink,
  Copy,
  Layers,
  Home,
  Maximize2
} from "lucide-react";
import "./App.css";

// Reusable components
const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const SectionHeading = ({ subtitle, title, light = false }) => (
  <div className="mb-16 text-center">
    <motion.p
      initial={{ opacity: 0, letterSpacing: "0.1em" }}
      whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
      className={`text-[10px] uppercase font-light mb-4 ${light ? "text-white/60" : "text-gray-400"}`}
    >
      {subtitle}
    </motion.p>
    <h2 className={`text-3xl md:text-5xl font-extralight tracking-tight text-white`}>
      {title}
    </h2>
  </div>
);

const Notification = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl border backdrop-blur-2xl flex items-center gap-4 shadow-2xl min-w-[320px] 
      ${type === 'success'
        ? 'bg-white/10 border-white/20 text-white shadow-white/5'
        : 'bg-red-500/10 border-red-500/20 text-red-200 shadow-red-500/5'
      }`}
  >
    {type === 'success' ? <CheckCircle2 className="text-white" size={24} /> : <AlertCircle className="text-red-400" size={24} />}
    <p className="text-sm font-light tracking-wide">{message}</p>
    <button onClick={onClose} className="ml-auto hover:opacity-60 transition-opacity"><X size={18} /></button>
  </motion.div>
);

const PhoneModal = ({ isOpen, onClose, phone }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md bg-black border border-white/10 rounded-[40px] p-10 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"><X size={24} className="text-white/40" /></button>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"><Phone size={32} className="text-white" /></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">Direct Contact</p>
            <h3 className="text-3xl font-light text-white mb-8 tracking-tight">{phone}</h3>
            <div className="grid grid-cols-2 gap-4 w-full">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-all"><Phone size={16} /> Call</a>
              <button onClick={() => { navigator.clipboard.writeText(phone); alert("Copied!"); }} className="flex items-center justify-center gap-3 py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-all"><Copy size={16} /> Copy</button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 1.1]);

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

  const collections = [
    {
      id: "maybach",
      name: "Project Maybach",
      tower: "Tower 1",
      units: "816",
      floors: "24 Residential",
      area: "8,763 SQM",
      image: "/col-maybach-30.jpg",
      highlight: "Off-Road Luxury"
    },
    {
      id: "ultimate-luxury",
      name: "Ultimate Luxury",
      tower: "Towers 2 & 3",
      units: "1,204",
      floors: "24 Residential",
      area: "14,220 SQM",
      image: "/col-luxury-34.jpg",
      highlight: "Curated Excellence"
    },
    {
      id: "maybach6",
      name: "Vision Maybach 6",
      tower: "Towers 4 & 5",
      units: "1,844",
      floors: "34 Residential",
      area: "14,325 SQM",
      image: "/col-maybach6-37.jpg",
      highlight: "Ultimate Sophistication"
    },
    {
      id: "iconic",
      name: "Vision Iconic",
      tower: "Tower 6",
      units: "1,404",
      floors: "66 Residential",
      area: "22,282 SQM",
      image: "/col-iconic-24.jpg",
      highlight: "66 Floors of Pure Luxury"
    },
    {
      id: "one-eleven",
      name: "Vision One-Eleven",
      tower: "Tower 7",
      units: "1,366",
      floors: "60 Residential",
      area: "7,901 SQM",
      image: "/col-one-eleven-51.jpg",
      highlight: "Iconic Proportions"
    },
    {
      id: "amg",
      name: "AMG Vision",
      tower: "Towers 8 & 9",
      units: "2,692",
      floors: "52 Residential",
      area: "11,626 SQM",
      image: "/col-amg-48.jpg",
      highlight: "High-Performance Living"
    },
    {
      id: "avtr",
      name: "VISION AVTR",
      tower: "Tower 10",
      units: "1,280",
      floors: "41 Residential",
      area: "12,835 SQM",
      image: "/col-avtr-44.jpg",
      highlight: "Futuristic Design"
    },
    {
      id: "simplex",
      name: "Vision Simplex",
      tower: "Towers 11 & 12",
      units: "2,208",
      floors: "35 Residential",
      area: "11,359 SQM",
      image: "/col-simplex-41.jpg",
      highlight: "Heritage Reimagined"
    }
  ];

  const amenities = [
    { icon: <Zap size={20} />, label: "Solar Photovoltaic" },
    { icon: <Award size={20} />, label: "LEED Certification" },
    { icon: <Activity size={20} />, label: "Skyline Jogging Path" },
    { icon: <Waves size={20} />, label: "Sky Infinity Pool" },
    { icon: <ShieldCheck size={20} />, label: "Smart System" },
    { icon: <Car size={20} />, label: "Valet Service" }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-white selection:text-black">

      <AnimatePresence>
        {notification && (
          <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
        )}
      </AnimatePresence>

      <PhoneModal isOpen={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} phone={contactInfo.phone} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 1 }} className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm md:text-xl font-semibold tracking-widest uppercase">DP REAL ESTATE</span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">Mercedes-Benz Places</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {["Overview", "Collections", "Amenities", "Location"].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors">{item}</button>
            ))}
            <button onClick={() => scrollToSection('inquiry')} className="px-6 py-2.5 bg-white text-black text-[11px] uppercase tracking-widest font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Register Interest</button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
          <video className="w-full h-full object-cover grayscale-[0.3]" autoPlay loop muted playsInline src="/high.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </motion.div>
        <div className="relative z-10 text-center px-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-xs md:text-sm uppercase tracking-[0.5em] text-white/80 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">World's First Branded City</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }} className="text-5xl md:text-8xl font-extralight tracking-tighter mb-8">Mercedes-Benz <span className="text-white/40">Places</span></motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button onClick={() => scrollToSection('overview')} className="px-10 py-4 bg-white text-black text-xs uppercase tracking-[0.3em] font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,255,255,0.2)]">Experience Now</button>
            <div className="flex items-center gap-4 text-white/60"><div className="h-px w-12 bg-white/20" /><span className="text-[10px] uppercase tracking-widest">Binghatti City | Dubai</span><div className="h-px w-12 bg-white/20" /></div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn direction="right">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-700" />
              <img src="/overview-08.jpg" alt="Vision" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
          </FadeIn>
          <div>
            <FadeIn delay={0.2}>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">Design Philosophy</p>
              <h2 className="text-4xl md:text-6xl font-extralight mb-8 leading-tight">Emotion and <br /><span className="text-white/40 italic">Intelligence.</span></h2>
              <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                <p>Mercedes-Benz Places | Binghatti City is a landmark residential community that redefines urban living. Not merely structures, but a masterplanned city-scale vision where global brand prestige becomes a personal, lived-in experience.</p>
                <p>Composed of 12 towers, the city establishes an undeniable presence. Structures exercise precision engineering, where flowing, sculpted surfaces embody kinetic energy and motion.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* COLLECTIONS REDESIGN */}
      <section id="collections" className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Architectural Masterpieces" title="The Exclusive Collections" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {collections.map((col, idx) => (
              <FadeIn key={col.id} delay={idx * 0.1}>
                <div className="group relative bg-black border border-white/10 rounded-[40px] overflow-hidden transition-all duration-700 hover:border-white/30 hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]">

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img src={col.image} alt={col.name} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000 grayscale-[0.2]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-10 flex flex-col h-full min-h-[480px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">{col.tower}</p>
                        <h3 className="text-3xl font-light tracking-tight">{col.name}</h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <Maximize2 size={16} className="text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <p className="text-xs text-white/80 font-medium tracking-widest mb-10 border-l-2 border-white/20 pl-4 uppercase">
                      {col.highlight}
                    </p>

                    <div className="mt-auto space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white/40">
                            <Home size={12} /> <span className="text-[9px] uppercase tracking-widest">Total Units</span>
                          </div>
                          <p className="text-sm font-light tracking-wide">{col.units}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white/40">
                            <Layers size={12} /> <span className="text-[9px] uppercase tracking-widest">Scale</span>
                          </div>
                          <p className="text-sm font-light tracking-wide">{col.floors}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Plot Area</p>
                          <p className="text-xs font-semibold text-white/90">{col.area}</p>
                        </div>
                        <button onClick={() => scrollToSection('inquiry')} className="p-4 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-xl">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-32 px-6"><div className="max-w-7xl mx-auto"><SectionHeading subtitle="Exclusive Services" title="Engineered for Life" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">{amenities.map((item, idx) => (<FadeIn key={idx} delay={idx * 0.05}><div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-center group"><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform group-hover:text-white">{item.icon}</div><span className="text-[10px] uppercase tracking-widest font-medium text-white/60 leading-tight">{item.label}</span></div></FadeIn>))}</div></div></section>

      {/* Location */}
      <section id="location" className="py-32 px-6 bg-black relative overflow-hidden"><div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.03] -skew-x-12 translate-x-1/2 blur-3xl" /><div className="max-w-7xl mx-auto relative z-10"><div className="grid lg:grid-cols-2 gap-20 items-center"><div><FadeIn><p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">Nad Al Sheba District</p><h2 className="text-4xl md:text-5xl font-extralight mb-8 leading-tight">Next In The <br /><span className="text-white/40">City of Now</span></h2><p className="text-gray-400 text-lg font-light leading-relaxed mb-10">Strategically located at the junction of Dubai's drive and unique artistry. The area is globally renowned for equestrian excellence and the iconic Meydan Racecourse.</p><div className="grid grid-cols-2 gap-8">{[{ time: "8 Minutes", place: "Dubai Mall / Burj Khalifa" }, { time: "15 Minutes", place: "Dubai Intl Airport" }, { time: "10 Minutes", place: "Business Bay" }, { time: "20 Minutes", place: "Palm Jumeirah" }].map((loc, idx) => (<div key={idx} className="space-y-1 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"><div className="flex items-center gap-2 text-white/60"><Clock size={14} /> <span className="text-[10px] uppercase tracking-widest">{loc.time}</span></div><p className="text-sm font-medium">{loc.place}</p></div>))}</div></FadeIn></div><FadeIn delay={0.3}><div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)]"><iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d137513.5444096678!2d55.31223936810359!3d25.08212905656814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f67b9e2599107%3A0x4a9e775524bcf3ec!2sMercedes-Benz%20Places%20%7C%20Binghatti%20City!5e0!3m2!1sen!2sae!4v1767957272068!5m2!1sen!2sae" className="w-full h-full border-0 grayscale invert opacity-80" loading="lazy" /></div></FadeIn></div></div></section>

      {/* Inquiry */}
      <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
        {/* Background Video for the whole section */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover opacity-40 grayscale"
            autoPlay
            loop
            muted
            playsInline
            src="/second.mp4"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16 relative z-10 overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.03)] backdrop-blur-sm">
          <div className="relative z-10">
            <SectionHeading subtitle="Secure Your Place" title="Inquire for Availability" />
            <form className="grid md:grid-cols-2 gap-6" onSubmit={async e => {
              e.preventDefault();
              setIsSubmitting(true);
              const payload = Object.fromEntries(new FormData(e.target));
              try {
                await axios.post("/.netlify/functions/lead", payload);
                setNotification({ type: 'success', message: "Registered successfully." });
                e.target.reset();
              } catch (err) {
                setNotification({ type: 'error', message: "Error submitting." });
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <input required name="name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors" placeholder={contactInfo.email} />
              </div> <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Phone</label>
                <input name="phone" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 transition-colors" placeholder={contactInfo.phone} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Preferred Unit</label>
                <select name="unit" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/40 appearance-none">
                  <option className="bg-black">Studio</option>
                  <option className="bg-black">1 Bedroom</option>
                  <option className="bg-black">2 Bedroom</option>
                  <option className="bg-black">3+ Bedroom</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
                <textarea rows="4" name="message" className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-white/40 resize-none" placeholder="How can we assist you?" />
              </div>
              <button disabled={isSubmitting} className="md:col-span-2 mt-4 py-5 bg-white text-black text-xs uppercase tracking-[0.4em] font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50">{isSubmitting ? "Processing..." : "Submit Interest"}</button>
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
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-widest uppercase leading-none mb-1">DP REAL ESTATE</span>
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/40 leading-none">Places | Binghatti</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm max-w-sm font-light">The world's first Mercedes-Benz branded city, bringing architectural excellence and unmatched luxury to Dubai's Meydan district.</p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <div className="flex items-center gap-3"><Mail size={16} /> <span>{contactInfo.email}</span></div>
              <div className="flex items-center gap-3"><Phone size={16} /> <span>{contactInfo.phone}</span></div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setPhoneModalOpen(true)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"><Phone size={18} /></button>
              <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-6">Official Websites</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-light">
              {contactInfo.websites.map(site => (
                <li key={site}>
                  <a href={`https://${site}`} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-2 transition-colors">
                    <Globe size={14} /> {site}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:ml-auto flex flex-col gap-6 text-right">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Location</span>
                <span className="text-sm font-light text-white/80">Nad Al Sheba, Dubai</span>
             </div>
             <button onClick={() => scrollToSection('inquiry')} className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-white/10 transition-all">
                Register Interest
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-gray-600">
          <span>© 2026 DP Real Estate. All rights reserved.</span>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
      {/* Fixed Contact Icons */}
      <div className="fixed bottom-10 right-10 z-40 flex flex-col gap-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setPhoneModalOpen(true)} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl"><Phone size={24} /></motion.button>
        <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl"><MessageCircle size={24} /></motion.a>
      </div>

    </div>
  );
}

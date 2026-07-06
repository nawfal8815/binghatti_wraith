import { Waves, Activity, Zap, Award, Globe, Home, Layers } from "lucide-react";

export const collections = [
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

export const amenities = [
  { icon: <Waves size={20} />, label: "Infinity Pool & Jacuzzi" },
  { icon: <Activity size={20} />, label: "Spa & Wellness Area" },
  { icon: <Zap size={20} />, label: "Gym & Yoga Deck" },
  { icon: <Award size={20} />, label: "Padel & Basketball Court" },
  { icon: <Globe size={20} />, label: "Palm Promenade" },
  { icon: <Home size={20} />, label: "Family BBQ & Social Area" },
  { icon: <Layers size={20} />, label: "Children's Play Areas" },
  { icon: <Zap size={20} />, label: "EV Charging Stations" }
];

// netlify/functions/features.js

exports.handler = async () => {
  const features = [
    {
      title: "Iconic Tower",
      text: "Signature skyscraper inspired by Mercedes‑Benz design."
    },
    {
      title: "Central Park",
      text: "12 curated experiences surrounded by greenery."
    },
    {
      title: "Premium Facilities",
      text: "Spa, gym, pools, and concierge service."
    },
    {
      title: "Location Advantages",
      text: "Minutes from Dubai International Airport, Dubai Mall & Business Bay."
    },
    {
      title: "Payment Plan",
      text: "20% down, 50% during construction, 30% on completion."
    }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(features), // must be string for Netlify[web:36][web:59]
    headers: {
      "Content-Type": "application/json"
    }
  };
};
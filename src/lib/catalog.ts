export const LAB_TESTS = [
  { name: "Malaria RDT + Full Blood Count", priceKobo: 750000, turnaround: "Same day", emoji: "🦟" },
  { name: "Typhoid (Widal) Test", priceKobo: 550000, turnaround: "Same day", emoji: "🧫" },
  { name: "Fasting Blood Sugar & HbA1c", priceKobo: 1200000, turnaround: "24 hours", emoji: "🩸" },
  { name: "Lipid Profile (Cholesterol)", priceKobo: 1500000, turnaround: "24 hours", emoji: "❤️" },
  { name: "Liver & Kidney Function Panel", priceKobo: 2200000, turnaround: "48 hours", emoji: "🫀" },
  { name: "Pregnancy Test + Ultrasound Referral", priceKobo: 900000, turnaround: "Same day", emoji: "🤰" },
  { name: "HIV, Hep B & C Screen (confidential)", priceKobo: 850000, turnaround: "Same day", emoji: "🔒" },
  { name: "Full Wellness Executive Package", priceKobo: 4500000, turnaround: "72 hours", emoji: "🧾" },
];

export const PLANS = [
  {
    id: "free",
    name: "Pay as you go",
    priceKobo: 0,
    period: "",
    perks: [
      "Pay per consultation from ₦1,500",
      "Free AI symptom checker",
      "Electronic health record",
      "USSD *347*247# fallback",
    ],
  },
  {
    id: "family",
    name: "Family Care",
    priceKobo: 750000,
    period: "/month",
    perks: [
      "Unlimited chat consultations",
      "6 video consultations monthly",
      "Cover up to 5 dependents",
      "20% off all lab tests",
      "Priority emergency response",
    ],
    popular: true,
  },
  {
    id: "sme",
    name: "SME / Corporate",
    priceKobo: 2500000,
    period: "/staff/yr",
    perks: [
      "Staff wellness dashboard",
      "Quarterly health screening",
      "Dedicated company doctor",
      "HMO integration & claims export",
      "On-site emergency drills",
    ],
  },
];

export const SPECIALTIES = [
  { name: "General Practice", emoji: "🩺" },
  { name: "Obstetrics & Gynaecology", emoji: "🤰" },
  { name: "Paediatrics", emoji: "👶" },
  { name: "Psychiatry & Counselling", emoji: "🧠" },
  { name: "Urology", emoji: "💧" },
  { name: "Orthopaedics & Trauma", emoji: "🦴" },
  { name: "Internal Medicine", emoji: "🫀" },
  { name: "Dermatology", emoji: "🧴" },
  { name: "Dentistry", emoji: "🦷" },
  { name: "Nutrition & Lifestyle", emoji: "🥗" },
];

export const EMERGENCY_NUMBERS = [
  { name: "National Emergency (NEMA)", number: "112", note: "Toll free, nationwide" },
  { name: "Lagos State Emergency (LASEMA)", number: "767", note: "Lagos only" },
  { name: "FRSC Road Accidents", number: "122", note: "Highway response" },
  { name: "NCDC Disease Hotline", number: "6232", note: "Outbreak reporting" },
  { name: "MyDoc247 Rapid Desk", number: "0700-247-247", note: "24/7 nurse triage" },
];

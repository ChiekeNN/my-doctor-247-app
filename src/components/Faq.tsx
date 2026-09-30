"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is MyDoc247?",
    a: "MyDoc247 is a Nigerian telemedicine platform that connects you to verified, MDCN-licensed doctors 24 hours a day — by chat, voice or video. We also offer home lab sample collection, e-prescriptions honoured at partner pharmacies, secure electronic health records and emergency response.",
  },
  {
    q: "Are your doctors really licensed?",
    a: "Every clinician is verified against their MDCN/MDCN-equivalent registration number before they can accept a consultation. Their licence number, specialty and qualifications are shown on their profile, alongside verified patient ratings.",
  },
  {
    q: "What if my network is slow or I have no data?",
    a: "The app is a PWA — it installs on your phone, weighs under 2MB and caches your records so you can view prescriptions offline. If you have no data at all, dial our USSD short code *347*247# or call 0700-247-247 to reach the IVR nurse triage desk on 2G.",
  },
  {
    q: "How much does a consultation cost?",
    a: "Chat consultations start from ₦1,500, voice from ₦2,000 and video from ₦2,500. The Family Care plan at ₦7,500/month gives unlimited chat, 6 video sessions, cover for 5 dependents and 20% off lab tests.",
  },
  {
    q: "Can I use it in Hausa, Yoruba, Igbo or Pidgin?",
    a: "Yes. You can filter doctors by the language they speak — English, Pidgin, Hausa, Yoruba and Igbo are supported across our panel, and your language preference is saved to your profile.",
  },
  {
    q: "Is my medical data safe?",
    a: "Your records are encrypted, access-controlled, and never shared with family, employers or insurers without your written consent. We align with the Nigeria Data Protection Act (NDPA) 2023 principles.",
  },
  {
    q: "Do you work with HMOs and insurance?",
    a: "Yes. Add your HMO provider in your profile and eligible consultations are billed to your plan, with claim-ready invoices you can export as PDF.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-3xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
      {FAQS.map((f, i) => (
        <div key={f.q} className="px-4">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <span className="font-semibold text-sm md:text-base">{f.q}</span>
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-transform ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="pb-5 text-sm leading-relaxed text-slate-600 animate-fadeup">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

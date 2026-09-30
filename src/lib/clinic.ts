type Rule = {
  test: RegExp;
  reply: string;
  diagnosis?: string;
  meds?: { name: string; dose: string; duration: string }[];
};

const RULES: Rule[] = [
  {
    test: /fever|hot body|temperature|malaria|chills/i,
    reply:
      "Thank you. Fever with chills in our environment is most often malaria, but we must confirm rather than assume. Please do a malaria RDT and full blood count — you can order it from the Lab tab and a phlebotomist will come to your address. Meanwhile, take paracetamol 1g every 8 hours, drink plenty of fluids and tepid-sponge if the temperature goes above 38.5°C. Has there been any vomiting or convulsion?",
    diagnosis: "Suspected uncomplicated malaria — confirm with RDT",
    meds: [
      { name: "Artemether/Lumefantrine 80/480mg", dose: "1 tablet twice daily after a fatty meal", duration: "3 days" },
      { name: "Paracetamol 1g", dose: "1 tablet every 8 hours as needed", duration: "3 days" },
    ],
  },
  {
    test: /cough|catarrh|sore throat|cold|sneez/i,
    reply:
      "Noted. Most coughs and catarrh here are viral and settle in 5–7 days. Steam inhalation, warm fluids, honey and lemon help a lot. Avoid antibiotics unless we confirm a bacterial cause. However, if the cough lasts beyond 2 weeks, or comes with weight loss or night sweats, we must screen for tuberculosis — that screening is free at government DOTS centres. Are you bringing out any phlegm, and what colour is it?",
    diagnosis: "Upper respiratory tract infection (viral)",
    meds: [
      { name: "Vitamin C 1000mg", dose: "1 tablet daily", duration: "7 days" },
      { name: "Loratadine 10mg", dose: "1 tablet at night", duration: "5 days" },
    ],
  },
  {
    test: /pressure|hypertens|bp |blood pressure/i,
    reply:
      "Blood pressure control is a marathon, not a sprint. Please log your readings morning and night in the Vitals tracker for the next 7 days so I can see the trend. Cut down salt and seasoning cubes, reduce alcohol, and walk 30 minutes at least five days a week. Very important: never stop your medication because you feel fine. What readings have you seen recently?",
    diagnosis: "Hypertension — for monitoring and lifestyle modification",
    meds: [
      { name: "Amlodipine 5mg", dose: "1 tablet every morning", duration: "30 days" },
    ],
  },
  {
    test: /sugar|diabet|glucose/i,
    reply:
      "Let's get an objective picture. Please check fasting blood sugar and HbA1c — both are in the Lab tab. On food, keep half your plate vegetables, a quarter protein, a quarter carbohydrate. Swap large eba portions for wheat, oat or unripe plantain swallow, and stop sugary drinks completely. Do you experience excessive thirst, frequent urination or tingling in the feet?",
    diagnosis: "Glycaemic review — pending HbA1c",
    meds: [{ name: "Metformin 500mg", dose: "1 tablet twice daily with meals", duration: "30 days" }],
  },
  {
    test: /pregnan|antenatal|missed period|baby kick/i,
    reply:
      "Congratulations, and thank you for reaching out early — early booking saves lives. You will need booking bloods (group, genotype, PCV, HIV/Hep B screen), urinalysis and a dating scan. Start folic acid immediately. Danger signs to never ignore: bleeding, severe headache with blurred vision, swollen face and hands, reduced baby movement, or fever. How many weeks along do you think you are?",
    diagnosis: "Antenatal care — first trimester counselling",
    meds: [
      { name: "Folic acid 5mg", dose: "1 tablet daily", duration: "12 weeks" },
      { name: "Ferrous sulphate 200mg", dose: "1 tablet daily after food", duration: "30 days" },
    ],
  },
  {
    test: /anxiet|depress|sad|stress|sleep|panic|suicid/i,
    reply:
      "Thank you for trusting me with this — what you are feeling is a medical issue, not a personal failure, and it responds very well to treatment. Let's start with structure: consistent sleep and wake times, 20 minutes of daylight movement, and reducing caffeine after 2pm. I would like to book you for a full counselling session this week. If you ever have thoughts of harming yourself, please use the SOS button immediately. How has your sleep been over the past two weeks?",
    diagnosis: "Anxiety/mood symptoms — for structured counselling",
    meds: [],
  },
  {
    test: /child|baby|toddler|my son|my daughter|immunis|vaccin/i,
    reply:
      "For children, we watch three things closely: feeding, activity and urine output. If the child is drinking well, playful and wetting nappies normally, we usually have time. Red flags needing immediate care: convulsion, fast or difficult breathing, inability to feed, sunken eyes, or a fever above 38°C in a baby under 3 months. Is the child immunisation up to date? You can set reminders in the app.",
    diagnosis: "Paediatric assessment",
    meds: [{ name: "Paracetamol suspension 120mg/5ml", dose: "As per weight, every 6 hours", duration: "3 days" }],
  },
  {
    test: /stomach|abdomen|abdominal|typhoid|diarrh|vomit|purg/i,
    reply:
      "Fluid replacement comes first — ORS (salt-sugar solution) after every loose stool. Avoid taking antibiotics on your own; Widal test alone is often over-diagnosed for typhoid, so we may need stool analysis or culture. Please tell me: is there blood in the stool, and are you able to keep fluids down?",
    diagnosis: "Acute gastroenteritis — rule out enteric fever",
    meds: [
      { name: "Oral Rehydration Salts", dose: "1 sachet in 1 litre clean water, sip through the day", duration: "3 days" },
      { name: "Zinc 20mg", dose: "1 tablet daily", duration: "10 days" },
    ],
  },
  {
    test: /skin|rash|itch|eczema|acne|pimple/i,
    reply:
      "For melanin-rich skin, gentle is best. Stop any bleaching or steroid-containing cream immediately — they thin the skin and cause stubborn dark patches. Use a mild fragrance-free cleanser, moisturise while the skin is damp, and use sunscreen daily even indoors near windows. Could you send a clear photo of the affected area in this chat?",
    diagnosis: "Dermatitis — for topical therapy",
    meds: [{ name: "Hydrocortisone 1% cream", dose: "Apply thinly twice daily", duration: "7 days" }],
  },
  {
    test: /chest pain|breath|collaps|faint|bleeding heavily|stroke/i,
    reply:
      "⚠️ This may be an emergency. Please stop chatting and act now: call 112 or tap the red SOS button so we can alert the nearest partner hospital and share your location. Do not drive yourself. If someone is with you, stay with them until help arrives.",
    diagnosis: "Possible emergency — escalated",
    meds: [],
  },
];

const FOLLOWUPS = [
  "Understood. Please continue the plan we discussed and log how you feel each day in the app.",
  "Thank you for the details — that helps. Anything else troubling you before I write my notes?",
  "Noted. If symptoms worsen at any point, reopen this consultation; it stays free for 72 hours.",
];

export function doctorReply(text: string, turn: number) {
  const rule = RULES.find((r) => r.test.test(text));
  if (rule) return rule;
  return {
    reply: FOLLOWUPS[turn % FOLLOWUPS.length],
    diagnosis: undefined,
    meds: undefined,
  } as Rule;
}

export function summarise(texts: string[]) {
  const joined = texts.join(" ");
  const rule = RULES.find((r) => r.test.test(joined));
  return {
    diagnosis: rule?.diagnosis ?? "General consultation — no acute findings",
    meds:
      rule?.meds && rule.meds.length
        ? rule.meds
        : [{ name: "Multivitamin", dose: "1 tablet daily", duration: "14 days" }],
    note:
      "History taken remotely via MyDoc247. " +
      (rule?.diagnosis ?? "Symptoms reviewed") +
      ". Patient counselled on red-flag symptoms and advised to return if condition worsens. Follow-up in 7 days or sooner if needed.",
  };
}

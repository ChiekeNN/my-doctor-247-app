export type SymptomOption = {
  id: string;
  label: string;
  emoji: string;
  red?: boolean;
};

export const SYMPTOMS: SymptomOption[] = [
  { id: "fever", label: "Fever / hot body", emoji: "🌡️" },
  { id: "headache", label: "Headache", emoji: "🤕" },
  { id: "chills", label: "Chills & body pain", emoji: "🥶" },
  { id: "vomiting", label: "Vomiting", emoji: "🤮" },
  { id: "diarrhoea", label: "Diarrhoea", emoji: "🚻" },
  { id: "cough", label: "Cough", emoji: "😷" },
  { id: "sore_throat", label: "Sore throat", emoji: "🗣️" },
  { id: "breathless", label: "Difficulty breathing", emoji: "🫁", red: true },
  { id: "chest_pain", label: "Chest pain", emoji: "💔", red: true },
  { id: "bleeding", label: "Heavy bleeding", emoji: "🩸", red: true },
  { id: "unconscious", label: "Fainting / confusion", emoji: "😵", red: true },
  { id: "rash", label: "Skin rash / itching", emoji: "🧴" },
  { id: "abdominal", label: "Abdominal pain", emoji: "🫄" },
  { id: "yellow_eyes", label: "Yellow eyes", emoji: "👁️" },
  { id: "painful_urine", label: "Painful urination", emoji: "💧" },
  { id: "dizziness", label: "Dizziness", emoji: "🌀" },
  { id: "anxiety", label: "Anxiety / low mood", emoji: "🧠" },
  { id: "pregnancy", label: "Pregnancy concern", emoji: "🤰" },
  { id: "child_under5", label: "Patient is under 5", emoji: "👶" },
  { id: "weight_loss", label: "Unexplained weight loss", emoji: "⚖️" },
];

export type TriageResult = {
  level: "emergency" | "urgent" | "routine" | "selfcare";
  headline: string;
  advice: string;
  possibleConditions: { name: string; likelihood: number; note: string }[];
  recommendedSpecialty: string;
  suggestedTests: string[];
};

export function runTriage(ids: string[], durationDays: number): TriageResult {
  const has = (x: string) => ids.includes(x);
  const conditions: { name: string; likelihood: number; note: string }[] = [];

  if (has("fever") && (has("chills") || has("headache"))) {
    conditions.push({
      name: "Malaria",
      likelihood: has("vomiting") ? 82 : 70,
      note: "Very common in Nigeria. A rapid diagnostic test (RDT) confirms in minutes.",
    });
  }
  if (has("fever") && (has("abdominal") || has("diarrhoea")) && durationDays >= 4) {
    conditions.push({
      name: "Typhoid fever",
      likelihood: 58,
      note: "Prolonged fever with abdominal symptoms. Widal/blood culture advised.",
    });
  }
  if (has("cough") && has("sore_throat")) {
    conditions.push({
      name: "Upper respiratory tract infection",
      likelihood: 64,
      note: "Usually viral and self-limiting; hydration and rest help.",
    });
  }
  if (has("cough") && has("weight_loss") && durationDays >= 14) {
    conditions.push({
      name: "Tuberculosis (screen needed)",
      likelihood: 45,
      note: "Cough over 2 weeks with weight loss requires free TB screening at a DOTS centre.",
    });
  }
  if (has("painful_urine")) {
    conditions.push({
      name: "Urinary tract infection",
      likelihood: 61,
      note: "Urinalysis and culture recommended before antibiotics.",
    });
  }
  if (has("yellow_eyes")) {
    conditions.push({
      name: "Hepatitis / jaundice",
      likelihood: 47,
      note: "Liver function tests and hepatitis screening needed.",
    });
  }
  if (has("anxiety")) {
    conditions.push({
      name: "Anxiety or mood disorder",
      likelihood: 55,
      note: "Confidential counselling sessions are available on MyDoc247.",
    });
  }
  if (has("rash")) {
    conditions.push({
      name: "Allergic dermatitis",
      likelihood: 50,
      note: "Avoid new soaps/detergents; antihistamines may help.",
    });
  }
  if (conditions.length === 0) {
    conditions.push({
      name: "Non-specific symptoms",
      likelihood: 40,
      note: "A doctor consultation will help narrow this down quickly.",
    });
  }

  const redFlag = SYMPTOMS.filter((s) => s.red).some((s) => ids.includes(s.id));
  const urgent =
    (has("fever") && has("child_under5")) ||
    (has("pregnancy") && (has("fever") || has("abdominal"))) ||
    (has("vomiting") && has("diarrhoea")) ||
    durationDays >= 7;

  let level: TriageResult["level"] = "selfcare";
  let headline = "Self-care with monitoring";
  let advice =
    "Your symptoms appear mild. Rest, drink plenty of clean water, and monitor for 48 hours. Chat a doctor if things change.";

  if (redFlag) {
    level = "emergency";
    headline = "Seek emergency care now";
    advice =
      "You reported a red-flag symptom. Call 112 (national emergency) or use the SOS button to alert the nearest partner hospital immediately. Do not wait for an online consultation.";
  } else if (urgent) {
    level = "urgent";
    headline = "See a doctor within 24 hours";
    advice =
      "Your combination of symptoms needs prompt assessment. Book an instant video or voice consultation today, and start a malaria/typhoid test if fever persists.";
  } else if (conditions[0].likelihood >= 55) {
    level = "routine";
    headline = "Book a consultation soon";
    advice =
      "Book a consultation in the next few days. Keep a symptom diary in the app and log your temperature twice daily.";
  }

  const specialty = has("pregnancy")
    ? "Obstetrics & Gynaecology"
    : has("child_under5")
      ? "Paediatrics"
      : has("anxiety")
        ? "Psychiatry & Counselling"
        : has("chest_pain")
          ? "Internal Medicine"
          : "General Practice";

  const tests: string[] = [];
  if (has("fever")) tests.push("Malaria RDT", "Full Blood Count");
  if (has("abdominal") || has("diarrhoea")) tests.push("Widal / Stool analysis");
  if (has("painful_urine")) tests.push("Urinalysis");
  if (has("yellow_eyes")) tests.push("Liver Function Test");
  if (has("weight_loss")) tests.push("Fasting Blood Sugar", "HIV & TB screen");
  if (tests.length === 0) tests.push("Basic wellness screen");

  return {
    level,
    headline,
    advice,
    possibleConditions: conditions.sort((a, b) => b.likelihood - a.likelihood).slice(0, 4),
    recommendedSpecialty: specialty,
    suggestedTests: Array.from(new Set(tests)),
  };
}

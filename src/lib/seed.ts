import { db } from "@/db";
import { doctors, articles } from "@/db/schema";
import { sql } from "drizzle-orm";

const DOCTORS = [
  {
    name: "Dr. Amaka Obi",
    specialty: "General Practice",
    bio: "13 years of frontline practice in Lagos teaching hospitals. Passionate about malaria stewardship and hypertension control.",
    qualifications: "MBBS, MPH (Ibadan)",
    mdcnNumber: "MDCN/64210",
    languages: "English, Igbo, Pidgin",
    yearsExperience: 13,
    rating: 4.9,
    reviewCount: 412,
    feeKobo: 250000,
    location: "Lagos",
    photo: "👩🏾‍⚕️",
  },
  {
    name: "Dr. Ibrahim Sanusi",
    specialty: "Internal Medicine",
    bio: "Consultant physician focused on diabetes, hypertension and cardiovascular risk in Northern Nigeria.",
    qualifications: "MBBS, FWACP",
    mdcnNumber: "MDCN/51988",
    languages: "English, Hausa",
    yearsExperience: 18,
    rating: 4.8,
    reviewCount: 287,
    feeKobo: 450000,
    location: "Kano",
    photo: "👨🏾‍⚕️",
  },
  {
    name: "Dr. Funmilayo Adeyemi",
    specialty: "Obstetrics & Gynaecology",
    bio: "Maternal health specialist. Antenatal guidance, fertility counselling and safe delivery planning.",
    qualifications: "MBBS, FMCOG",
    mdcnNumber: "MDCN/47321",
    languages: "English, Yoruba",
    yearsExperience: 16,
    rating: 5.0,
    reviewCount: 533,
    feeKobo: 500000,
    location: "Ibadan",
    photo: "👩🏾‍⚕️",
  },
  {
    name: "Dr. Chinedu Eze",
    specialty: "Paediatrics",
    bio: "Child health, immunisation schedules and neonatal care. Gentle with anxious first-time parents.",
    qualifications: "MBBS, FWACP (Paed)",
    mdcnNumber: "MDCN/59014",
    languages: "English, Igbo",
    yearsExperience: 11,
    rating: 4.9,
    reviewCount: 361,
    feeKobo: 350000,
    location: "Enugu",
    photo: "👨🏾‍⚕️",
  },
  {
    name: "Dr. Zainab Bello",
    specialty: "Psychiatry & Counselling",
    bio: "Confidential therapy for anxiety, depression, burnout and relationship stress. Stigma-free space.",
    qualifications: "MBBS, MSc Clinical Psychology",
    mdcnNumber: "MDCN/62117",
    languages: "English, Hausa, Pidgin",
    yearsExperience: 9,
    rating: 4.9,
    reviewCount: 198,
    feeKobo: 400000,
    location: "Abuja",
    photo: "👩🏾‍⚕️",
  },
  {
    name: "Dr. Tunde Bakare",
    specialty: "Orthopaedics & Trauma",
    bio: "Sports injuries, fracture aftercare and physiotherapy planning for road traffic trauma.",
    qualifications: "MBBS, FMCS (Ortho)",
    mdcnNumber: "MDCN/43880",
    languages: "English, Yoruba",
    yearsExperience: 20,
    rating: 4.7,
    reviewCount: 145,
    feeKobo: 550000,
    location: "Lagos",
    photo: "👨🏾‍⚕️",
  },
  {
    name: "Dr. Grace Nwachukwu",
    specialty: "Dermatology",
    bio: "Eczema, acne, hyperpigmentation and safe skincare for melanin-rich skin.",
    qualifications: "MBBS, FMCP (Derm)",
    mdcnNumber: "MDCN/66902",
    languages: "English, Igbo",
    yearsExperience: 8,
    rating: 4.8,
    reviewCount: 233,
    feeKobo: 400000,
    location: "Port Harcourt",
    photo: "👩🏾‍⚕️",
  },
  {
    name: "Dr. Musa Danjuma",
    specialty: "Urology",
    bio: "Men's health, prostate screening, kidney stones and sexual health counselling.",
    qualifications: "MBBS, FWACS",
    mdcnNumber: "MDCN/40255",
    languages: "English, Hausa",
    yearsExperience: 17,
    rating: 4.7,
    reviewCount: 122,
    feeKobo: 500000,
    location: "Kaduna",
    photo: "👨🏾‍⚕️",
  },
  {
    name: "Dr. Kemi Salako",
    specialty: "Nutrition & Lifestyle",
    bio: "Weight management, diabetic meal plans built around Nigerian foods — swallow, rice and soups.",
    qualifications: "MBBS, Dip. Clinical Nutrition",
    mdcnNumber: "MDCN/70441",
    languages: "English, Yoruba, Pidgin",
    yearsExperience: 7,
    rating: 4.9,
    reviewCount: 176,
    feeKobo: 200000,
    location: "Abeokuta",
    photo: "👩🏾‍⚕️",
  },
  {
    name: "Dr. Emeka Okafor",
    specialty: "Dentistry",
    bio: "Toothache triage, gum disease, and cosmetic dentistry referrals nationwide.",
    qualifications: "BDS, FWACS",
    mdcnNumber: "MDCN/58120",
    languages: "English, Igbo",
    yearsExperience: 12,
    rating: 4.6,
    reviewCount: 98,
    feeKobo: 300000,
    location: "Awka",
    photo: "👨🏾‍⚕️",
  },
];

const ARTICLES = [
  {
    slug: "malaria-rainy-season",
    title: "Rainy season malaria: what every Nigerian household should do",
    category: "Prevention",
    excerpt:
      "Stagnant water after heavy rain creates mosquito breeding grounds. Here's a practical 7-step routine that cuts household malaria cases.",
    emoji: "🦟",
    readMinutes: 4,
    body:
      "Malaria remains Nigeria's biggest infectious disease burden. During the rainy season, Anopheles mosquitoes breed in stagnant water around compounds.\n\n1. Clear stagnant water weekly — buckets, tyres, gutters and plant pots.\n2. Sleep under a long-lasting insecticidal net (LLIN), especially children under 5 and pregnant women.\n3. Use screens on windows and doors; repair torn netting immediately.\n4. Do not self-medicate with leftover antimalarials — resistance is real.\n5. Test before you treat. A rapid diagnostic test costs less than a wrong prescription.\n6. Complete the full ACT dose even when you feel better after day two.\n7. Pregnant women should take intermittent preventive treatment (IPTp) as advised at antenatal clinic.\n\nIf fever lasts more than 48 hours, or there is vomiting, convulsion or confusion, treat it as an emergency.",
  },
  {
    slug: "hypertension-silent-killer",
    title: "Hypertension: the silent killer in 1 of 3 Nigerian adults",
    category: "Chronic Care",
    excerpt:
      "Most people discover high blood pressure after damage has begun. Learn how to monitor at home and what numbers actually matter.",
    emoji: "🫀",
    readMinutes: 5,
    body:
      "About one in three Nigerian adults lives with raised blood pressure, and many do not know it.\n\nWhat the numbers mean: below 120/80 is ideal. 130-139/80-89 is raised. 140/90 and above on two separate days is hypertension.\n\nPractical steps: reduce salt and seasoning cubes, cut back on palm oil-heavy stews, walk 30 minutes five times a week, limit alcohol, and never stop medication because you 'feel fine'.\n\nLog your readings in the MyDoc247 Vitals tracker — your doctor can review the trend before your next consultation.",
  },
  {
    slug: "mental-health-stigma",
    title: "It's okay to talk: breaking mental health stigma in Nigeria",
    category: "Mental Health",
    excerpt:
      "Depression and anxiety are medical conditions, not spiritual failure. Confidential help is one tap away.",
    emoji: "🧠",
    readMinutes: 4,
    body:
      "Mental illness in Nigeria is often hidden because of stigma. Yet anxiety, depression and burnout respond very well to treatment.\n\nWarning signs: persistent low mood for over two weeks, loss of interest, sleep changes, appetite changes, hopelessness, or thoughts of self-harm.\n\nWhat helps: talking therapy, structured routines, exercise, community support and — where needed — medication prescribed by a psychiatrist.\n\nMyDoc247 counselling sessions are private. Nothing is shared with family or employers without your written consent.",
  },
  {
    slug: "antenatal-checklist",
    title: "Your antenatal checklist: appointment by appointment",
    category: "Maternal Health",
    excerpt:
      "From the first missed period to delivery day — the tests, scans and danger signs every expectant mother should know.",
    emoji: "🤰",
    readMinutes: 6,
    body:
      "Book antenatal care as soon as you suspect pregnancy. Early booking saves lives.\n\nFirst trimester: confirm pregnancy, blood group and genotype, PCV, HIV/Hep B screening, urinalysis, dating scan.\n\nSecond trimester: anomaly scan at 18-22 weeks, tetanus vaccination, IPTp for malaria, iron and folate supplements.\n\nThird trimester: growth scan, birth plan, blood pressure monitoring for pre-eclampsia.\n\nDanger signs — go to hospital immediately: bleeding, severe headache with blurred vision, reduced baby movement, swollen face and hands, fever, or leaking fluid before 37 weeks.",
  },
  {
    slug: "diabetes-nigerian-plate",
    title: "Eating well with diabetes on a Nigerian plate",
    category: "Nutrition",
    excerpt:
      "You don't have to abandon swallow. Learn smart portions, better swaps and the glycaemic truth about our staples.",
    emoji: "🥗",
    readMinutes: 5,
    body:
      "Managing diabetes does not mean eating foreign food.\n\nBetter swaps: wheat, oat or unripe plantain swallow instead of large portions of eba; brown rice or ofada in place of white rice; more vegetable soup (efo riro, edikaikong) and less starchy sides.\n\nPortion rule: half the plate vegetables, a quarter protein (fish, chicken, beans), a quarter carbohydrate.\n\nAvoid sugary soft drinks and 'sugar-free' claims that are not verified. Check fasting sugar at least twice weekly and log it in the app.",
  },
  {
    slug: "child-immunisation",
    title: "Nigeria's child immunisation schedule made simple",
    category: "Child Health",
    excerpt:
      "BCG at birth through measles at nine months — a parent-friendly table with reminders you can set in-app.",
    emoji: "👶",
    readMinutes: 3,
    body:
      "At birth: BCG, OPV0, Hepatitis B.\n6 weeks: Pentavalent 1, OPV1, PCV1, Rotavirus 1.\n10 weeks: Pentavalent 2, OPV2, PCV2, Rotavirus 2.\n14 weeks: Pentavalent 3, OPV3, PCV3, IPV.\n6 months: Vitamin A.\n9 months: Measles 1, Yellow fever, Meningitis A.\n15 months: Measles 2.\n\nSet a reminder in MyDoc247 so you never miss a date. Immunisation at government primary health centres is free.",
  },
];

export async function ensureSeed() {
  try {
    const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(doctors);
    if (!row || row.count === 0) {
      await db.insert(doctors).values(
        DOCTORS.map((d, i) => ({ ...d, availableNow: i % 4 !== 3, verified: true })),
      );
    }
    const [a] = await db.select({ count: sql<number>`count(*)::int` }).from(articles);
    if (!a || a.count === 0) {
      await db.insert(articles).values(ARTICLES);
    }
  } catch {
    // ignore seeding errors (e.g. table not yet created during build)
  }
}

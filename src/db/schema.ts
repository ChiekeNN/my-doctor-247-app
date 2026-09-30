import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  date,
  real,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("patient"), // patient | doctor
  state: text("state").default("Lagos"),
  language: text("language").default("English"),
  gender: text("gender"),
  dob: date("dob"),
  bloodGroup: text("blood_group"),
  genotype: text("genotype"),
  allergies: text("allergies"),
  hmoProvider: text("hmo_provider"),
  walletKobo: integer("wallet_kobo").notNull().default(0),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull().default(""),
  qualifications: text("qualifications").notNull().default("MBBS"),
  mdcnNumber: text("mdcn_number").notNull().default(""),
  languages: text("languages").notNull().default("English"),
  yearsExperience: integer("years_experience").notNull().default(5),
  rating: real("rating").notNull().default(4.8),
  reviewCount: integer("review_count").notNull().default(0),
  feeKobo: integer("fee_kobo").notNull().default(250000),
  availableNow: boolean("available_now").notNull().default(true),
  verified: boolean("verified").notNull().default(true),
  photo: text("photo").notNull().default(""),
  location: text("location").notNull().default("Lagos"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  patientName: text("patient_name").notNull().default(""),
  mode: text("mode").notNull().default("chat"), // chat | voice | video | home
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming | active | completed | cancelled
  reason: text("reason").notNull().default(""),
  triage: text("triage").notNull().default("routine"),
  feeKobo: integer("fee_kobo").notNull().default(0),
  doctorNote: text("doctor_note").notNull().default(""),
  diagnosis: text("diagnosis").notNull().default(""),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  sender: text("sender").notNull(), // patient | doctor | system
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  appointmentId: integer("appointment_id"),
  doctorName: text("doctor_name").notNull(),
  refCode: text("ref_code").notNull(),
  medications: jsonb("medications").notNull().default([]),
  instructions: text("instructions").notNull().default(""),
  status: text("status").notNull().default("active"), // active | dispensed | expired
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // bp | sugar | weight | temp | spo2 | steps
  value: text("value").notNull(),
  numeric: real("numeric_value").notNull().default(0),
  note: text("note").notNull().default(""),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const labOrders = pgTable("lab_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  testName: text("test_name").notNull(),
  priceKobo: integer("price_kobo").notNull(),
  collectionType: text("collection_type").notNull().default("home"),
  address: text("address").notNull().default(""),
  status: text("status").notNull().default("scheduled"),
  resultSummary: text("result_summary").notNull().default(""),
  scheduledAt: timestamp("scheduled_at").notNull().defaultNow(),
});

export const walletTx = pgTable("wallet_tx", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amountKobo: integer("amount_kobo").notNull(),
  type: text("type").notNull(), // credit | debit
  description: text("description").notNull(),
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dependents = pgTable("dependents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  dob: date("dob"),
  gender: text("gender").notNull().default("female"),
});

export const triageChecks = pgTable("triage_checks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symptoms: jsonb("symptoms").notNull().default([]),
  level: text("level").notNull(),
  advice: text("advice").notNull(),
  possibleConditions: jsonb("possible_conditions").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  readMinutes: integer("read_minutes").notNull().default(3),
  emoji: text("emoji").notNull().default("💊"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  timeOfDay: text("time_of_day").notNull(),
  frequency: text("frequency").notNull().default("daily"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

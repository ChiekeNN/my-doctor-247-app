import type { UserRole } from "./roles";

export type DemoAccount = {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  language: string;
  walletKobo: number;
};

// Public demo credentials; demo-user creation is disabled in production by default.
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "admin",
    fullName: "MyDoc247 Demo Admin",
    email: "admin@mydoc247.com.ng",
    password: "admin1234",
    phone: "08012345670",
    state: "FCT - Abuja",
    language: "English",
    walletKobo: 0,
  },
  {
    role: "doctor",
    fullName: "Dr. Chinedu Demo",
    email: "doctor@mydoc247.com.ng",
    password: "doctor1234",
    phone: "08012345679",
    state: "Lagos",
    language: "English",
    walletKobo: 0,
  },
  {
    role: "patient",
    fullName: "Ada Demo",
    email: "demo@mydoc247.com.ng",
    password: "demo1234",
    phone: "08012345678",
    state: "Lagos",
    language: "English",
    walletKobo: 500000,
  },
  {
    role: "institution",
    fullName: "MyDoc247 Demo Medical Centre",
    email: "institution@mydoc247.com.ng",
    password: "clinic1234",
    phone: "08012345671",
    state: "Lagos",
    language: "English",
    walletKobo: 0,
  },
];

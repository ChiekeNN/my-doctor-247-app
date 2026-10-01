export const USER_ROLES = ["admin", "doctor", "patient", "institution"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type StaffRole = Exclude<UserRole, "patient">;

export const ROLE_INFO: Record<UserRole, { label: string; icon: string; description: string }> = {
  admin: {
    label: "Admin",
    icon: "🛡️",
    description: "Platform operations",
  },
  doctor: {
    label: "Doctor",
    icon: "🩺",
    description: "Clinical workspace",
  },
  patient: {
    label: "Patient",
    icon: "🧑🏾‍⚕️",
    description: "Personal healthcare",
  },
  institution: {
    label: "Medical institution",
    icon: "🏥",
    description: "Hospital or health centre",
  },
};

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function isStaffRole(value: string): value is StaffRole {
  return value === "admin" || value === "doctor" || value === "institution";
}

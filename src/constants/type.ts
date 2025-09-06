export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const Role = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MENTOR: "MENTOR",
  MENTEE: "MENTEE",
  Guest: "Guest",
} as const;

export const RoleValues = [
  Role.ADMIN,
  Role.STAFF,
  Role.MENTOR,
  Role.MENTEE,
  Role.Guest,
] as const;

export const ManagerRoom = "manager" as const;

export const AuthType = {
  default: 'default',
  google: 'google',
};

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export enum AuthRole {
  admin = 1,
  owner = 2,
  branch = 3,
  superStaff = 4,
  staff = 5,
  client = 6,
}

// export type AuthRole = (typeof AuthRole)[keyof typeof AuthRole]

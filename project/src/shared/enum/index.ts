export const AuthType = {
  default: 'default',
  google: 'google',
};

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export const AuthRole = {
  default: 'default',
  google: 'google',
};

export type AuthRole = (typeof AuthRole)[keyof typeof AuthRole];

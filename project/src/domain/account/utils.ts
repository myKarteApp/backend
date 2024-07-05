export const AccountFields: string[] = [
  'auth.authId',
  'auth.authRole',
  'auth.email',
  'auth.authType',
  'auth.authRole',
  'auth.isVerify',
  'auth.isTrial',
  'user.userId',
  'user.birthDay',
  'user.sex',
  'user.familyName',
  'user.givenName',
  'user.tel',
  'user.profession',
  'user.createdAt',
];

export const AccountJoiner = `
    AuthInfo AS auth
INNER JOIN
    UserInfo AS user
ON
    auth.authId = user.authId
`;

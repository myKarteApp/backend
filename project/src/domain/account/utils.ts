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
  'user.gender',
  'user.familyName',
  'user.givenName',
  'user.tel',
  'user.address',
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

export const AccountLeftOutJoiner = `
    AuthInfo AS auth
LEFT OUTER JOIN
    UserInfo AS user
ON
    auth.authId = user.authId
`;

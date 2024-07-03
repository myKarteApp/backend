export const clientFields: string[] = [
  'auth.email',
  'auth.authType',
  'auth.authRole',
  'auth.identityConfirmed',
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

export const ClientJoiner = `
    AuthInfo as auth
INNER JOIN
    UserInfo as user
ON
    auth.authId = user.authId
INNER JOIN
    ClientInfo as client
ON
    client.authId = auth.authId
    AND auth.isDeleted = false
    AND user.isDeleted = false
    AND client.isDeleted = false
`;

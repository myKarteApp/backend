import { UserAuthDefaultModule } from './user/auth/default';

export const controllerModuleList = [
  /*
    POST /user/auth/default/create
    GET /user/auth/default/:authId
    PUT /user/auth/default/:authId/update
    PUT /user/auth/default/:authId/delete
    GET /user/auth/default/
  */
  UserAuthDefaultModule,
];

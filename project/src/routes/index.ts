import { RouteAuthModule } from './account/auth/RouteAuth.module';
import { RouterAdminModule } from './account/roles/admin';
import { RouteUserModule } from './account/user/RouteUser.module';

export const controllerModuleList = [
  RouterAdminModule,
  RouteAuthModule,
  RouteUserModule,
];

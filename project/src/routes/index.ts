import { RouterAuthModule } from './account/auth/RouterAuth.module';
import { RouterAdminModule } from './account/roles/admin';
import { RouteUserModule } from './account/user/RouteUser.module';

export const controllerModuleList = [
  RouterAdminModule,
  RouterAuthModule,
  RouteUserModule,
];

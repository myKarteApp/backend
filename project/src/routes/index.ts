import { RouterAuthModule } from './account/auth/RouterAuth.module';
import { RouterAdminModule } from './account/roles/admin';
import { RouterAdminTestModule } from './account/roles/admin/test/AdminTest.module';
import { RouteUserModule } from './account/user/RouteUser.module';

export const controllerModuleList = [
  RouterAdminModule,
  RouterAdminTestModule,
  RouterAuthModule,
  RouteUserModule,
];

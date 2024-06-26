import { DefaultAuthDto, UserInfoDto } from '../dto';
import { AuthType, AuthRole } from '../enum';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiSchemaInfo = {
  /*
    デフォルト認証型: /auth/default
  */
  createAuthDefault: {
    endpoint: '/account/auth/default/create';
    method: HttpMethod.POST;
    request: {
      body: DefaultAuthDto;
    };
    response: {
      200: {
        message: string;
        data: {
          authId: string;
        };
      };
    };
  };
  loginAuthDefault: {
    endpoint: '/account/auth/default/login';
    method: HttpMethod.POST;
    request: {
      body: DefaultAuthDto;
    };
    response: {
      200: {
        message: string;
        data: {
          authId: string;
        };
      };
    };
  };
  logoutAuthDefault: {
    endpoint: '/account/auth/default/:authId/logout';
    method: HttpMethod.POST;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
      };
    };
  };

  /*
    Crud: UserInfo
  */
  createUserInfo: {
    endpoint: '/account/user/create';
    method: HttpMethod.POST;
    request: {
      body: UserInfoDto;
    };
    response: {
      200: {
        message: string;
        data: {
          userId: string;
        };
      };
    };
  };

  /*
    Crud AccountInfo
  */
  getAccount: {
    endpoint: '/:authId/account/:targetAuthId';
    method: HttpMethod.GET;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
        data: {
          authId: string;
          email: string;
          authType: AuthType;
          authRole: AuthRole;
        };
      };
    };
  };
  getAccountList: {
    endpoint: '/:authId/account';
    method: HttpMethod.GET;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
        data: {
          authList: {
            authId: string;
            email: string;
            authType: AuthType;
            authRole: AuthRole;
          };
        };
      };
    };
  };

  /*
    Adminデフォルト認証型: /admin/auth/default
  */
  loginAdminAuthDefault: {
    endpoint: '/admin/auth/default/login';
    method: HttpMethod.POST;
    request: {
      body: DefaultAuthDto;
    };
    response: {
      200: {
        message: string;
        data: {
          authId: string;
        };
      };
    };
  };
  logoutAdminAuthDefault: {
    endpoint: '/admin/auth/default/:authId/logout';
    method: HttpMethod.POST;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
      };
    };
  };

  /*
    Adminデフォルト認証型: /admin/auth/default
  */
};

export type RequestBody<Action extends keyof ApiSchemaInfo> =
  ApiSchemaInfo[Action]['request']['body'];

// // // TODO: やりかえる。
// export type ResponseBody<Action extends keyof ApiSchemaInfo> =
//   | ApiSchemaInfo[Action]['response'][200]['content']['application/json']
//   | ApiSchemaInfo[Action]['response']['default']['content']['application/json'];

export type ResponseBody<Action extends keyof ApiSchemaInfo> =
  ApiSchemaInfo[Action]['response'][200];

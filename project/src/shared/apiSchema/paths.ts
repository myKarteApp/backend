import { DefaultAuthDto } from '../dto';
import { AuthRole, AuthType } from '../enum';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiSchemaInfo = {
  /*
    デフォルト認証型: /user/auth/default
  */
  createUserAuthDefault: {
    endpoint: '/user/auth/default/create';
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
  loginUserAuthDefault: {
    endpoint: '/user/auth/default/login';
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
  logoutUserAuthDefault: {
    endpoint: '/user/auth/default/:authId/logout';
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
  getUserAuthDefault: {
    endpoint: '/user/auth/default/:authId';
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
  getListOfUserAuthDefault: {
    endpoint: '/user/auth/default';
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
};

export type RequestBody<Action extends keyof ApiSchemaInfo> =
  ApiSchemaInfo[Action]['request']['body'];

// // // TODO: やりかえる。
// export type ResponseBody<Action extends keyof ApiSchemaInfo> =
//   | ApiSchemaInfo[Action]['response'][200]['content']['application/json']
//   | ApiSchemaInfo[Action]['response']['default']['content']['application/json'];

export type ResponseBody<Action extends keyof ApiSchemaInfo> =
  ApiSchemaInfo[Action]['response'][200];

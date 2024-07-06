import {
  AccountInfoOfDB,
  CreateAccountInfoDto,
  CreateDefaultAuthDto,
  CreateUserInfoDto,
  LoginDefaultAuthDto,
  RegisterDto,
  UserIdListDto,
} from '../dto';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiSchemaInfo = {
  /*
      AdminAccount: /admin/{userId}/account
      userIdは自身のモノ。
    */
  createAccountByAdmin: {
    endpoint: '/admin/{userId}/account/create';
    method: HttpMethod.POST;
    request: {
      body: CreateAccountInfoDto;
    };
    response: {
      200: {
        message: string;
        data: {
          // テストで使える
          authId: string;
        };
      };
    };
  };
  getAccountListByAdmin: {
    endpoint: '/admin/{userId}/account';
    method: HttpMethod.GET;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
        data: {
          // テストで使える
          accountList: AccountInfoOfDB[];
        };
      };
    };
  };
  getAccountDetailByAdmin: {
    endpoint: '/admin/{userId}/account/{targetUserId}';
    method: HttpMethod.GET;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
        data: {
          // テストで使える
          account: AccountInfoOfDB;
        };
      };
    };
  };
  updateAccountByAdmin: {
    endpoint: '/admin/{userId}/account/{targetUserId}/update';
    method: HttpMethod.PUT;
    request: {
      body: Partial<CreateAccountInfoDto>;
    };
    response: {
      200: {
        message: string;
      };
    };
  };
  deleteAccountByAdmin: {
    endpoint: '/admin/{userId}/account/{targetUserId}/delete';
    method: HttpMethod.DELETE;
    request: {
      body: never;
    };
    response: {
      200: {
        message: string;
      };
    };
  };
  bulkDeleteAccountByAdmin: {
    endpoint: '/admin/{userId}/account/bulkDelete';
    method: HttpMethod.POST;
    request: {
      body: UserIdListDto;
    };
    response: {
      200: {
        message: string;
      };
    };
  };
  /*
      AuthDefault: /account/auth/default
      自身の認証情報を作成する
    */
  createAuthDefault: {
    endpoint: '/account/auth/default/create';
    method: HttpMethod.POST;
    request: {
      body: CreateDefaultAuthDto;
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
      body: LoginDefaultAuthDto;
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
    endpoint: '/account/auth/default/logout';
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
    AccountUser: /account/user
    自身のユーザー情報を作成する
*/
  createAccountUser: {
    endpoint: '/account/user/:authId/create';
    method: HttpMethod.POST;
    request: {
      body: CreateUserInfoDto;
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
      AccountAuthVerify: /account/auth/verify
      認証情報を承認する
    */
  confirmRegistration: {
    endpoint: '/account/auth/verify?queryToken={token}';
    query: {
      queryToken: string;
    };
    method: HttpMethod.GET;
    request: {
      body: never;
    };
    response: {
      // NOTE: htmlファイルが返ってくる
      200: {
        message: string;
      };
    };
  };
  register: {
    endpoint: '/account/auth/verify';
    method: HttpMethod.POST;
    request: {
      body: RegisterDto;
    };
    response: {
      200: {
        message: string;
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

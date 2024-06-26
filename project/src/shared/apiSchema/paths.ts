import { DefaultAuthDto, AccountDto } from '../dto';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiSchemaInfo = {
  loginUserAuthDefault: {
    endpoint: '/user/auth/default';
    method: HttpMethod.POST;
    request: {
      body: DefaultAuthDto;
    };
    response: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': CommonSchema<AccountDto>['schemas']['OkResponse'];
        };
      };
      default: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': CommonSchema<never>['schemas']['ErrorResponse'];
        };
      };
    };
  };
};

export interface CommonSchema<T> {
  schemas: {
    OkResponse: {
      data: T;
    };
    ErrorResponse: {
      error: {
        code: string;
        status: string;
        message: string;
      };
    };
  };
}

export type RequestBody<Action extends keyof ApiSchemaInfo> =
  ApiSchemaInfo[Action]['request']['body'];

// // TODO: やりかえる。
export type ResponseBody<Action extends keyof ApiSchemaInfo> =
  | ApiSchemaInfo[Action]['response'][200]['content']['application/json']
  | ApiSchemaInfo[Action]['response']['default']['content']['application/json'];

export type Response<Action extends keyof ApiSchemaInfo> =
  | ApiSchemaInfo[Action]['response'][200]
  | ApiSchemaInfo[Action]['response'];

// // src/csrf.middleware.ts

// import { Injectable, NestMiddleware } from '@nestjs/common';
// import * as csurf from 'csurf';

// @Injectable()
// export class CsrfMiddleware implements NestMiddleware {
//   private csrfProtection = csurf({ cookie: true });

//   use(req, res, next) {
//     // /account/auth/verify にのみ csurf ミドルウェアを適用する
//     if (req.url.startsWith('/account/auth/verify')) {
//       return this.csrfProtection(req, res, next);
//     }
//     next();
//   }
// }

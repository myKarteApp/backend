import { BadRequest } from './error';
import { ErrorCode } from './errorCode';

export function escapeSqlString(_value: any) {
  let value = _value;
  if (typeof _value !== 'string') {
    value = `${_value}`;
  }

  // 特殊文字のエスケープ
  const escapedValue = value.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (char) {
    switch (char) {
      case '\0':
      case '\n':
      case '\r':
      case '\b':
      case '\t':
      case '\x1a':
      case "'":
      case '"':
      case '\\':
        // TODO: エラーとせずにエスケープする
        throw BadRequest(ErrorCode.Error47);
      default:
        return '\\' + char;
    }
  });
  return escapedValue;
}

// const sqlInjectionPatternList = [
//   // 文字列の挿入による攻撃
//   "' OR '1'='1",
//   "' OR 1=1 --",
//   "'; DROP TABLE users; --",

//   // 数値の挿入による攻撃
//   '1 OR 1=1 --',
//   '1; DROP TABLE users; --',

//   // SQLキーワードを利用した攻撃
//   "admin'; --",
//   "' UNION SELECT password FROM users --",

//   // ブラインドSQLインジェクション
//   "' AND 1=1 --",
//   "' AND 1=2 --",

//   // エラーベースSQLインジェクション
//   "' AND EXISTS(SELECT * FROM users WHERE username = 'admin' AND substr(password, 1, 1) = 'a') --",

//   // タイムベースSQLインジェクション
//   "' AND IF(ASCII(SUBSTRING(database(), 1, 1)) = 97, sleep(10), 0) --",

//   // コメントアウトを利用した攻撃
//   "' --",

//   // ネステッドクエリによる攻撃
//   "' AND (SELECT COUNT(*) FROM users) > 0 --",

//   // データベースシステム固有の攻撃 (例: MySQL)
//   "' /*!OR*/ 1=1 --",
//   "' /*!UNION*/ SELECT password FROM users --",

//   // その他の攻撃パターンをここに追加する
// ];

export enum TimezoneOffset {
  UTC = 0,
  JST = 9,
  PST = -8,
  EST = -5,
  CET = 1,
  IST = 5.5, // インド標準時
  AEST = 10, // オーストラリア東部標準時
  NZST = 12, // ニュージーランド標準時
}

export function getQueryParams(url: string): Record<string, string> {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }

  const queryParams = queryString
    .split('&')
    .reduce((acc: { [key: string]: string }, param) => {
      const [key, value] = param.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

  return queryParams;
}
export function getOffsetByName(name: string): number | undefined {
  const enumKeys = Object.keys(
    TimezoneOffset,
  ) as (keyof typeof TimezoneOffset)[];
  const key = enumKeys.find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? TimezoneOffset[key] : undefined;
}

export function getCurrentTimeFromRequest(request: any): Date {
  let queryParams: { [key: string]: any } = {};
  const { referer } = request.headers;
  if (referer) {
    queryParams = getQueryParams(referer);
  } else {
    queryParams = request.query;
  }

  const { tz } = queryParams;
  let offset: number | undefined = 0;
  const utcNow = new Date();
  if (tz) {
    offset = getOffsetByName(tz);
    if (!offset) {
      offset = TimezoneOffset.JST;
    }
    const jstOffset = offset * 60 * 60 * 1000; // JSTはUTC+9なので、ミリ秒単位で9時間分
    return new Date(utcNow.getTime() + jstOffset);
  }
  return utcNow;
}

export function getEnumValue<T extends { [key: string]: string }>(
  enumType: T,
  value: string,
): T[keyof T] {
  const enumValues = Object.values(enumType) as string[];
  if (enumValues.includes(value)) {
    return value as T[keyof T];
  } else {
    throw new Error(`Value '${value}' does not exist in enum`);
  }
}

export function removeUndefined<T extends Record<string, any>>(
  obj: Partial<T>,
): {
  [key: string]: any;
} {
  const result: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T];
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  });

  return result;
}

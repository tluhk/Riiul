import {DateTime} from "luxon";

const toCamel = (str: string) => {
  return str.replace(/([-_][a-z])/ig, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
};

export function snakeCaseToCamelCase<T>(input: Record<any, any>): T {
  const result: Record<any, any> = {}
  Object.keys(input).forEach((key) => {
    let value = input[key]
    if (value instanceof Date) {
      value = DateTime.fromJSDate(value)
    }

    result[toCamel(key)] = value === null ? undefined : value
  })

  return result as T
}
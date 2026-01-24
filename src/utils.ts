import { isArray, mapValues } from 'lodash'
import { isPlainObject, omitUndefined } from 'ytil'

export function prepareData(data: unknown): unknown {
  return recursivelyRemoveUndefined(data)
}

export function recursivelyRemoveUndefined(obj: any): any {
  const iter = (value: unknown): unknown => {
    if (isArray(value)) {
      return value.map(iter)
    } else if (isPlainObject(value)) {
      const mapped = mapValues(value, iter)
      return omitUndefined(mapped)
    } else {
      return value
    }
  }

  return iter(obj)
}
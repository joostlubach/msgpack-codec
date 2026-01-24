import { isArray } from 'lodash'
import { isPlainObject, omitUndefined } from 'ytil'

export function prepareData(data: unknown): unknown {
  return recursivelyRemoveUndefined(data)
}

export function recursivelyRemoveUndefined(obj: any): any {
  const iter = (value: unknown): unknown => {
    if (isArray(value)) {
      return value.map(iter).filter(it => it !== undefined)
    } else if (isPlainObject(value)) {
      return omitUndefined(value)
    } else {
      return value
    }
  }

  return iter(obj)
}
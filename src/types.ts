import { decode, encode } from '@msgpack/msgpack'

// @ts-ignore TS6133 This is a marker type only.
export type Encoded<T> = ReturnType<encode> 

// @ts-ignore TS6133 This is a marker type only.
export type Decodeable<T> = Parameters<typeof decode>[0]

export interface ExtensionTypeCodec<T> {
  check:  (input: unknown) => boolean
  encode: (input: T) => Encoded<T> | null
  decode: (data: Decodeable<T>) => T
}

export interface ExtensionTypeDowngrade<T, U> {
  check:     (input: unknown) => boolean
  downgrade: (input: T) => U
  upgrade:   (downgraded: U) => T
}
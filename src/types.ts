import { decode, encode } from '@msgpack/msgpack'

export type Encoded = ReturnType<typeof encode> 
export type Decodable = Parameters<typeof decode>[0]

export interface ExtensionTypeCodec<T> {
  check:  (input: unknown) => boolean
  encode: (input: T) => Encoded | null
  decode: (data: Decodable) => T
}

export interface ExtensionTypeDowngrade<T, U> {
  check:     (input: unknown) => boolean
  downgrade: (input: T) => U
  upgrade:   (downgraded: U) => T
}
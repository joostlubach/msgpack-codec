export interface ExtensionTypeCodec<T> {
  check:  (input: unknown) => boolean
  encode: (input: T) => Uint8Array | null
  decode: (data: Uint8Array) => T
}

export interface ExtensionTypeDowngrade<T, U> {
  check:     (input: unknown) => boolean
  downgrade: (input: T) => U
  upgrade:   (downgraded: U) => T
}
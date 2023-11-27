import {
  decode as msgpack_decode,
  DecoderOptions,
  encode as msgpack_encode,
  EncoderOptions,
  ExtensionCodec,
} from '@msgpack/msgpack'
import { DecodeError, EncodeError } from './errors'
import { ExtensionTypeCodec, ExtensionTypeDowngrade } from './types'

export default class MsgpackCodec {

  private extensionCodec = new ExtensionCodec()

  public encode(data: any, options: Omit<EncoderOptions<never>, 'extensionCodec'> = {}) {
    try {
      return msgpack_encode(data, {
        ...options,
        extensionCodec: this.extensionCodec,
      })
    } catch (error) {
      throw new EncodeError(data, error)
    }
  }

  public decode(data: Uint8Array, options: Omit<DecoderOptions<never>, 'extensionCodec'> = {}) {
    try {
      return msgpack_decode(data, {
        ...options,
        extensionCodec: this.extensionCodec,
      })
    } catch (error) {
      throw new DecodeError(error)
    }
  }

  public registerExtensionType<T>(type: number, {check, encode, decode}: ExtensionTypeCodec<T>) {
    // msgpack doesn't check this, but `type` can only be a byte long.
    if (type < 0 || type > 217) {
      throw new Error(`Extension type must be between 0x00 and 0xFF, got 0x${type.toString(16)}`)
    }

    this.extensionCodec.register({
      type,
      encode: val => check(val) ? encode(val as any) : null,
      decode,
    })
  }

  public registerExtensionTypeDowngrade<T, U>(type: number, {check, downgrade, upgrade}: ExtensionTypeDowngrade<T, U>) {
    return this.registerExtensionType<T>(type, {
      check,
      encode: (val) => {
        const downgraded = downgrade(val as any)
        return this.encode(downgraded)
      },
      decode: (raw) => {
        const downgraded = this.decode(raw) as any
        return upgrade(downgraded) as any
      },
    })
  }

}

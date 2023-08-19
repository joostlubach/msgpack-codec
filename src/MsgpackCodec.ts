import * as msgpack from '@msgpack/msgpack'
import { ExtensionTypeCodec, ExtensionTypeDowngrade } from './types'

export default class MsgpackCodec {

  private extensionCodec = new msgpack.ExtensionCodec()

  public encode(data: any) {
    return msgpack.encode(data, {extensionCodec: this.extensionCodec})
  }

  public decode(data: Uint8Array) {
    return msgpack.decode(data, {extensionCodec: this.extensionCodec})
  }

  public registerExtensionType<T>(type: number, codec: ExtensionTypeCodec<T>) {
    this.extensionCodec.register({
      type,
      encode: (val) => {
        if (!codec.check(val)) { return null }
        return codec.encode(val as any)
      },
      decode: (raw) => {
        return codec.decode(raw) as any
      }
    })
  }

  public registerExtensionTypeDowngrade<T, U>(type: number, {check, downgrade, upgrade}: ExtensionTypeDowngrade<T, U>) {
    this.extensionCodec.register({
      type,

      encode: (val) => {
        if (!check(val)) { return null }
        const downgraded = downgrade(val as any)
        return this.encode(downgraded)
      },

      decode: (raw) => {
        const downgraded = this.decode(raw) as any
        return upgrade(downgraded) as any
      }
    })
  }

}
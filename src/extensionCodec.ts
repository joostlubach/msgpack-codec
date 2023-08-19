import { ExtensionCodec } from '@msgpack/msgpack'

const extensionCodec = new ExtensionCodec()

const DATETIME_TYPE = 0x01
extensionCodec.register({
  type: DATETIME_TYPE,
})

export default extensionCodec
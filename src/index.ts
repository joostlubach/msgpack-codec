import Emitter from 'component-emitter'
import { isPlainObject } from 'ytil'
import { decode, encode } from '@msgpack/msgpack'
import extensionCodec from './extensionCodec'

export class Encoder {
  encode(packet: any) {
    return [encode(packet, {extensionCodec})]
  }
}

export class Decoder extends Emitter {

  add(chunk: any) {
    const packet = decode(chunk, {extensionCodec})
    if (this.isPacketValid(packet)) {
      this.emit('decoded', packet);
    } else {
      throw new Error('invalid format');
    }
  }

  isPacketValid(packet: unknown): packet is any {
    if (!isPlainObject(packet)) { return false }

    const {nsp, type, id, data} = packet as any
    const isNamespaceValid = typeof nsp === 'string';
    const isAckIdValid = id === undefined || Number.isInteger(id);
    if (!isNamespaceValid || !isAckIdValid) {
      return false;
    }
    switch (type) {
      case 0: // CONNECT
        return data === undefined || typeof data === 'object';
      case 1: // DISCONNECT
        return data === undefined;
      case 2: // EVENT
        return Array.isArray(data) && data.length > 0;
      case 3: // ACK
        return Array.isArray(data);
      case 4: // CONNECT_ERROR
        return typeof data === 'object';
      default:
        return false;
    }
  }

  destroy() {}
}

export { extensionCodec }

const parser = {Encoder, Decoder}
export default parser
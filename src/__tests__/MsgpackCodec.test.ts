import { Buffer } from 'buffer'
import MsgpackCodec from '../MsgpackCodec'

describe("MsgpackCodec", () => {

  let codec: MsgpackCodec

  beforeEach(() => {
     codec = new MsgpackCodec()
  })

  it("should allow encoding and decoding any kind of data that msgpack can", () => {
    expect(codec.decode(codec.encode(1))).toEqual(1)
    expect(codec.decode(codec.encode('foo'))).toEqual('foo')
    expect(codec.decode(codec.encode(true))).toEqual(true)
    expect(codec.decode(codec.encode({a: 1, b: 2}))).toEqual({a: 1, b: 2})
    expect(codec.decode(codec.encode([2, 3, 5, 7, 11]))).toEqual([2, 3, 5, 7, 11])

    const date = new Date(1983, 1, 24, 19, 30, 2)
    expect(codec.decode(codec.encode(date))).toEqual(date)
  })

  describe('extensions', () => {

    it("should allow registering a custom type", () => {
      class MyClass {
        constructor(public readonly name: string) {}
      }

      codec.registerExtensionType<MyClass>(0x01, {
        check:  val => val instanceof MyClass,
        encode: val => Buffer.from(val.name),
        decode: arr => new MyClass(Buffer.from(arr).toString())
      })

      const val = new MyClass('foo')
      const out = codec.decode(codec.encode(val))
      expect(out).toBeInstanceOf(MyClass)
      expect(out).toEqual({name: 'foo'})
    })

    it("should allow registering a custom type downgrade", () => {
      class MyClass {
        constructor(public readonly name: string) {}
      }

      codec.registerExtensionTypeDowngrade<MyClass, string>(0x01, {
        check:     val => val instanceof MyClass,
        downgrade: val => val.name,
        upgrade:   name => new MyClass(name)
      })

      const val = new MyClass('foo')
      const out = codec.decode(codec.encode(val))
      expect(out).toBeInstanceOf(MyClass)
      expect(out).toEqual({name: 'foo'})
    })

    it("should not mix up custom types", () => {
      class ClassA {
        constructor(public readonly name: string) {}
      }
      class ClassB {
        constructor(public readonly name: string) {}
      }

      codec.registerExtensionTypeDowngrade<ClassA, string>(0x0001, {
        check:     val => val instanceof ClassA,
        downgrade: val => val.name,
        upgrade:   name => new ClassA(name)
      })
      codec.registerExtensionTypeDowngrade<ClassB, string>(0x0002, {
        check:     val => val instanceof ClassB,
        downgrade: val => val.name,
        upgrade:   name => new ClassB(name)
      })

      const valA = new ClassA('foo')
      const valB = new ClassB('foo')

      const outA = codec.decode(codec.encode(valA))
      const outB = codec.decode(codec.encode(valB))

      expect(outA).toBeInstanceOf(ClassA)
      expect(outB).toBeInstanceOf(ClassB)
    })

  })

})
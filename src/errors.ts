export class EncodeError extends Error {

  constructor(
    data: any,
    cause: unknown,
  ) {
    if (cause instanceof Error) {
      super(`Error while encoding data: ${cause.message}`, {cause})
    } else {
      super("Error while encoding data", {cause})
    }

    this.data = data
  }

  public readonly data: any

}

export class DecodeError extends Error {

  constructor(cause: unknown) {
    if (cause instanceof Error) {
      super(`Error while decoding data: ${cause.message}`, {cause})
    } else {
      super("Error while decoding data", {cause})
    }
  }

}

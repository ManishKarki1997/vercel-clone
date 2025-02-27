
// TODO setup a logger later
export const logError = (...args: any) => {
  console.log(args);
}

export class HTTPError extends Error {
  public status: number;
  public name: string;
  public extra: any;

  constructor({ status, name, message, extra }: { status: number, name: string, message: string, extra?: any }) {
    super(message);
    this.status = status;
    this.name = name;
    this.extra = extra;
  }
}

export class UserInputError extends HTTPError {
  constructor(message: string, extra?: any) {
    super({
      status: 400,
      name: "Bad Request",
      message,
      extra
    });
  }
}

export class AuthenticationError extends HTTPError {
  constructor(message: string, extra?: any) {
    super({
      status: 401,
      name: "Unauthorized",
      message,
      extra
    });
  }
}

export class ForbiddenError extends HTTPError {
  constructor(message: string, extra?: any) {
    super({
      status: 403,
      name: "Forbidden",
      message,
      extra
    });
  }
}

export class NotFoundError extends HTTPError {
  constructor(message: string, extra?: any) {
    super({
      status: 404,
      name: "Not Found",
      message,
      extra
    });
  }
}

export class InternalServerError extends HTTPError {
  constructor(message: string, extra?: any) {
    super({
      status: 500,
      name: "Internal Server Error",
      message,
      extra
    });
  }
}
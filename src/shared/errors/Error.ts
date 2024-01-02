export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(message: string) {
    super(message, 405);
    this.name = 'MethodNotAllowedError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export class NotImplemented extends ApiError {
  constructor(message: string) {
    super(message, 501);
    this.name = 'NotImplemented';
  }
}

export class BadGateway extends ApiError {
  constructor(message: string) {
    super(message, 502);
    this.name = 'BadGateway';
  }
}

export class ServiceUnavailable extends ApiError {
  constructor(message: string) {
    super(message, 503);
    this.name = 'ServiceUnavailable';
  }
}

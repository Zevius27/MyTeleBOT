export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DirectoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DirectoryError';
  }
}

export class FileTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileTypeError';
  }
}

export class FileSizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSizeError';
  }
}

export class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
  }
}
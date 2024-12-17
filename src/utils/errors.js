export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DirectoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DirectoryError';// will be used to handle errors related to directories
  }
}

export class FileTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileTypeError';// will be used to handle errors related to file type
  }
}

export class FileSizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSizeError';// will be used to handle errors related to file size
  }
}

export class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';// will be used to handle errors related to security
  }
}
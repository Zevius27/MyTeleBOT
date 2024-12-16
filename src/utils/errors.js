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
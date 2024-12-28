import { describe, it, expect } from 'vitest';
import { validateFile } from '../../utils/fileValidation.js';
import { FileTypeError, FileSizeError } from '../../utils/errors.js';

describe('File Validation', () => {
  it('should accept valid files', () => {
    const validFile = {
      file_size: (1024 * 1024) * 10, // 10MB
      file_name: 'test.pdf'
    };
    expect(() => validateFile(validFile)).not.toThrow();
  });

  it('should reject oversized files', () => {
    const largeFile = {
      file_size: 150 * 1024 * 1024, // 150MB (exceeds 100MB limit)
      file_name: 'large.pdf'
    };
    expect(() => validateFile(largeFile)).toThrow(FileSizeError);
  });

  it('should reject unsupported file types', () => {
    const invalidFile = {
      file_size: 1024,
      file_name: 'test.exe'
    };
    expect(() => validateFile(invalidFile)).toThrow(FileTypeError);
  });

  it('should handle files without extensions', () => {
    const noExtFile = {
      file_size: 1024,
      file_name: 'testfile'
    };
    expect(() => validateFile(noExtFile)).toThrow(FileTypeError);
  });

  it('should handle special characters in filenames', () => {
    const specialFile = {
      file_size: 1024,
      file_name: 'test#$%.pdf'
    };
    expect(() => validateFile(specialFile)).not.toThrow();
  });

  it('should handle unicode characters in filenames', () => {
    const unicodeFile = {
      file_size: 1024,
      file_name: '测试文件.pdf'
    };
    expect(() => validateFile(unicodeFile)).not.toThrow();
  });
}); 
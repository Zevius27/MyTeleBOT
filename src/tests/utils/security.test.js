import { describe, it, expect } from 'vitest';
import { sanitizeFilename, validateUsername } from '../../utils/security.js';

describe('Security Utils', () => {
  describe('sanitizeFilename', () => {
    it('should preserve valid filenames', () => {
      expect(sanitizeFilename('test.jpg')).toBe('test.jpg');
      expect(sanitizeFilename('my-file.pdf')).toBe('my-file.pdf');
    });

    it('should preserve extension case', () => {
      expect(sanitizeFilename('test.JPG')).toBe('test.JPG');
      expect(sanitizeFilename('doc.PDF')).toBe('doc.PDF');
    });

    it('should handle path traversal attempts', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
      expect(sanitizeFilename('..\\Windows\\System32')).toBe('WindowsSystem32');
    });

    it('should handle empty or invalid input', () => {
      expect(sanitizeFilename('')).toMatch(/^file_\d+$/);
      expect(sanitizeFilename(null)).toThrow('Invalid filename');
      expect(sanitizeFilename(undefined)).toThrow('Invalid filename');
    });
  });

  describe('validateUsername', () => {
    it('should allow valid usernames', () => {
      expect(validateUsername('john_doe123')).toBe('john_doe123');
      expect(validateUsername('user_123')).toBe('user_123');
    });

    it('should remove invalid characters', () => {
      expect(validateUsername('john@doe')).toBe('johndoe');
      expect(validateUsername('user-name!')).toBe('username');
    });

    it('should throw error for invalid input', () => {
      expect(() => validateUsername(null)).toThrow('Invalid username');
      expect(() => validateUsername(undefined)).toThrow('Invalid username');
      expect(() => validateUsername(123)).toThrow('Invalid username');
    });
  });
}); 
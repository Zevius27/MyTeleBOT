import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { DirectoryError, SecurityError, FileTypeError, FileSizeError } from '../../utils/errors.js';

describe('AsyncHandler', () => {
  it('should handle successful operations', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockFn).toHaveBeenCalledWith(mockCtx, undefined);
    expect(mockCtx.reply).not.toHaveBeenCalled();
  });

  it('should handle FileTypeError', async () => {
    const error = new FileTypeError('Invalid file type');
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith('This file type is not supported');
  });

  it('should handle FileSizeError', async () => {
    const error = new FileSizeError('File too large');
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith('File size exceeds the maximum limit');
  });

  it('should handle DirectoryError', async () => {
    const error = new DirectoryError('Directory error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith('Error accessing file directory');
  });

  it('should handle SecurityError', async () => {
    const error = new SecurityError('Security error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith('Security check failed');
  });

  it('should handle operation timeouts', async () => {
    const mockFn = vi.fn().mockImplementation(() => 
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), 5000);
      })
    );
    const mockCtx = {
      reply: vi.fn()
    };
    
    await expect(asyncHandler(mockFn)(mockCtx)).rejects.toThrow();
  });

  it('should handle concurrent operations', async () => {
    const mockCtx = {
      reply: vi.fn(),
      message: {
        from: { username: 'testuser' }
      }
    };
    
    const operations = Array(5).fill().map(() => {
      const handler = asyncHandler(async (ctx) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'success';
      });
      return handler(mockCtx);
    });
    
    await expect(Promise.all(operations)).resolves.not.toThrow();
  });
}); 
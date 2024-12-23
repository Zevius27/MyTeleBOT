import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { DirectoryError, SecurityError } from '../../utils/errors.js';
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
    const error = new Error('Invalid file type');
    error.name = 'FileTypeError';
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockCtx = {
      reply: vi.fn()
    };

    const handler = asyncHandler(mockFn);
    await handler(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith('This file type is not supported');
  });

  it('should handle FileSizeError', async () => {
    const error = new Error('File too large');
    error.name = 'FileSizeError';
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
}); 
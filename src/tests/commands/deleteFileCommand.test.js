import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleDelete } from '../../commands/deleteFileCommand.js';
import fs from 'fs';
import { DirectoryError } from '../../utils/errors.js';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    promises: {
      readdir: vi.fn(),
      unlink: vi.fn()
    }
  }
}));

describe('Delete File Command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.DOWNLOAD_BASE_PATH = '/test/path';
  });

  it('should show usage when no filename provided', async () => {
    const mockCtx = {
      message: {
        text: '/delete',
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(true);
    await handleDelete(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining('Usage: /delete'));
  });

  it('should handle non-existent directory', async () => {
    const mockCtx = {
      message: {
        text: '/delete test.txt',
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(false);

    await handleDelete(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith('No files found. Please upload some files first.');
  });

  it('should handle file not found', async () => {
    const mockCtx = {
      message: {
        text: '/delete test.txt',
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(true);
    fs.promises.readdir.mockResolvedValue([]);

    await handleDelete(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining('File not found'));
  });
}); 
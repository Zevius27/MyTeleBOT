import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleRename } from '../../commands/renameFileCommand.js';
import fs from 'fs';
import { DirectoryError } from '../../utils/errors.js';

vi.mock('fs');

describe('Rename File Command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.DOWNLOAD_BASE_PATH = '/test/path';
  });

  it('should show usage when insufficient arguments provided', async () => {
    const mockCtx = {
      message: {
        text: '/rename oldfile.txt',
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    await handleRename(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining('Usage: /rename'));
  });

  it('should handle non-existent directory', async () => {
    const mockCtx = {
      message: {
        text: '/rename oldfile.txt newfile.txt',
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(false);

    await handleRename(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith('No files found. Please upload some files first.');
  });

  it('should handle file not found', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.promises.readdir.mockResolvedValue(['some-other-file.txt']);

    const ctx = {
      message: {
        text: '/rename nonexistent.txt new.txt',
        from: {
          username: 'testuser'
        }
      },
      reply: jest.fn()
    };

    await handleRename(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(
      expect.stringContaining('File not found')
    );
  });
}); 
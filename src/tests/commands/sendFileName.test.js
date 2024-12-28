import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleSendFileName } from '../../commands/sendFileName.js';
import fs from 'fs';
import { DirectoryError } from '../../utils/errors.js';

vi.mock('fs');

describe('Send File Name Command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.DOWNLOAD_BASE_PATH = '/test/path';
  });

  it('should handle non-existent directory', async () => {
    const mockCtx = {
      message: {
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(false);

    await handleSendFileName(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith('No files found. Please upload some files first.');
  });

  it('should list files when directory exists', async () => {
    const mockCtx = {
      message: {
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(true);
    fs.promises.readdir.mockResolvedValue(['file1.txt', 'file2.jpg']);

    await handleSendFileName(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(
      'Your files:\n<code>file1.txt</code>\n<code>file2.jpg</code>',
      { parse_mode: 'HTML' }
    );
  });

  it('should handle empty directory', async () => {
    const mockCtx = {
      message: {
        from: { username: 'testuser' }
      },
      reply: vi.fn()
    };

    fs.existsSync.mockReturnValue(true);
    fs.promises.readdir.mockResolvedValue([]);

    await handleSendFileName(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith('No files found. Please upload some files first.');
  });
}); 
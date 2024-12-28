import { vi } from 'vitest';

export default {
  existsSync: vi.fn(),
  promises: {
    readdir: vi.fn(),
    unlink: vi.fn(),
    rename: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn()
  }
}; 
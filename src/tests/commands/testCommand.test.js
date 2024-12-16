import { describe, it, expect, vi } from 'vitest';
import { handleTest } from '../../commands/testCommand.js';

describe('Test Command', () => {
  it('should send success message', async () => {
    const mockCtx = {
      reply: vi.fn()
    };

    await handleTest(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith('Bot is up and running! ✅');
  });
}); 
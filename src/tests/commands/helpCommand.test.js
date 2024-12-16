import { describe, it, expect, vi } from 'vitest';
import { handleHelp } from '../../commands/helpCommand.js';

describe('Help Command', () => {
  it('should send help message', async () => {
    const mockCtx = {
      reply: vi.fn()
    };

    await handleHelp(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalled();
    expect(mockCtx.reply.mock.calls[0][0]).toContain('File Storage Bot Help');
    expect(mockCtx.reply.mock.calls[0][1]).toEqual({ parse_mode: 'HTML' });
  });
}); 
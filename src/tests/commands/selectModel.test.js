import { describe, it, expect, beforeEach, vi } from 'vitest';
import { selectModel } from '../../commands/selectModel.js';

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    promises: {
      readdir: vi.fn(),
      unlink: vi.fn(),
      rename: vi.fn()
    }
  }
}));

describe('Select Model Command', () => {
  it('should set default model when no valid model is provided', async () => {
    const mockCtx = {
      message: {
        text: 'invalid_model'
      },
      reply: vi.fn()
    };

    await selectModel(mockCtx);
    expect(process.env.MODEL_NAME).toBe('hf:meta-llama/Llama-3.1-405B-Instruct');
  });

  it('should set specified model when valid model is provided', async () => {
    const mockCtx = {
      message: {
        text: 'hf:google/gemma-2-9b-it'
      },
      reply: vi.fn()
    };

    await selectModel(mockCtx);
    expect(process.env.MODEL_NAME).toBe('hf:google/gemma-2-9b-it');
  });
}); 
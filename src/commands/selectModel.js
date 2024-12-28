import { handleFetchModels } from "./modelHandler.js";
  
export const selectModel =  async (ctx) => {
    await handleFetchModels(ctx);
    let modelName; // Declare model variable
    switch(ctx.message.text) {
      case 'hf:Qwen/Qwen2.5-Coder-32B-Instruct':
        modelName = 'hf:Qwen/Qwen2.5-Coder-32B-Instruct';
        break;
      case 'hf:Qwen/Qwen2.5-72B-Instruct':
        modelName = 'hf:Qwen/Qwen2.5-72B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.1-405B-Instruct':
        modelName = 'hf:meta-llama/Llama-3.1-405B-Instruct';
        break;
      case 'hf:mistralai/Mistral-7B-Instruct-v0.3':
        modelName = 'hf:mistralai/Mistral-7B-Instruct-v0.3';
        break;
      case 'hf:huihui-ai/Llama-3.3-70B-Instruct-abliterated':
        modelName = 'hf:huihui-ai/Llama-3.3-70B-Instruct-abliterated';
        break;
      case 'hf:meta-llama/Llama-3.1-70B-Instruct':
        modelName = 'hf:meta-llama/Llama-3.1-70B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.1-8B-Instruct':
        modelName = 'hf:meta-llama/Llama-3.1-8B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-3B-Instruct':
        modelName = 'hf:meta-llama/Llama-3.2-3B-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-11B-Vision-Instruct':
        modelName = 'hf:meta-llama/Llama-3.2-11B-Vision-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.2-90B-Vision-Instruct':
        modelName = 'hf:meta-llama/Llama-3.2-90B-Vision-Instruct';
        break;
      case 'hf:meta-llama/Llama-3.3-70B-Instruct':
        modelName = 'hf:meta-llama/Llama-3.3-70B-Instruct';
        break;
      case 'hf:google/gemma-2-9b-it':
        modelName = 'hf:google/gemma-2-9b-it';
        break;
      case 'hf:google/gemma-2-27b-it':
        modelName = 'hf:google/gemma-2-27b-it';
        break;
      case 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1':
        modelName = 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1';
        break;
      case 'hf:mistralai/Mixtral-8x22B-Instruct-v0.1':
        modelName = 'hf:mistralai/Mixtral-8x22B-Instruct-v0.1';
        break;
      case 'hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO':
        modelName = 'hf:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO';
        break;
      case 'hf:Qwen/Qwen2.5-7B-Instruct':
        modelName = 'hf:Qwen/Qwen2.5-7B-Instruct';
        break;
      case 'hf:upstage/SOLAR-10.7B-Instruct-v1.0':
        modelName = 'hf:upstage/SOLAR-10.7B-Instruct-v1.0';
        break;
      case 'hf:nvidia/Llama-3.1-Nemotron-70B-Instruct-HF':
        modelName = 'hf:nvidia/Llama-3.1-Nemotron-70B-Instruct-HF';
        break;
      default:
        modelName = 'hf:meta-llama/Llama-3.3-70B-Instruct'; // Default model
    }
    process.env.MODEL_NAME = modelName;
    await ctx.reply(`Model changed to ${modelName} \n\n` +
    'THE MODEL IS NOT AVAILABLE FOR TEXT MESSAGES YET. 🚫📩');
    return modelName;
  };


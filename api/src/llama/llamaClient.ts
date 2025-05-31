import LlamaAPIClient from 'llama-api-client';

export const llamaClient = new LlamaAPIClient({
    apiKey: process.env['LLAMA_API_KEY'], // This is the default and can be omitted
});
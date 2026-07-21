const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
   baseURL: 'http://localhost:11434/v1',
   apiKey: 'ollama'
});

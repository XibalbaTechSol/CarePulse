import { AIProviderService } from './src/lib/ai/provider';

async function verify() {
    console.log('--- local LLM Verification ---');

    try {
        const aiService = AIProviderService.getInstance();
        console.log('Testing text generation with local Ollama (phi3:mini)...');

        const response = await aiService.generateText('Tell me a short joke about a nurse.');
        console.log('\nResponse:');
        console.log(response.text);

        console.log('\n--- Verification Successful ---');
    } catch (error) {
        console.error('\n--- Verification Failed ---');
        console.error(error);
        process.exit(1);
    }
}

verify();

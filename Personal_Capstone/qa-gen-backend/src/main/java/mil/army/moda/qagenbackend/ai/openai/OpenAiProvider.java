package mil.army.moda.qagenbackend.ai.openai;

import mil.army.moda.qagenbackend.ai.AiProvider;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Component;

@Component
public class OpenAiProvider implements AiProvider {

    @Override
    public String getProviderName() {
        return "openai";
    }

    @Override
    public String generateExplanation(String prompt, String apiKey) {
        // 1. Pass the dynamic BYOK key into the new Options builder
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .apiKey(apiKey)
                .model("gpt-4o-2024-08-06")
                .build();

        // 2. Build the model. It automatically sets up the official OpenAI client using your options.
        OpenAiChatModel chatModel = OpenAiChatModel.builder()
                .options(options)
                .build();

        // 3. Call the model and return the static explanation
        return chatModel.call(prompt);
    }
}
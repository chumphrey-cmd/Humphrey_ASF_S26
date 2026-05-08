package mil.army.moda.qagenbackend.ai.gemini;

import com.google.genai.Client;
import mil.army.moda.qagenbackend.ai.AiProvider;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Component;

@Component
public class GeminiProvider implements AiProvider {

    @Override
    public String getProviderName() {
        return "gemini";
    }

    @Override
    public String generateExplanation(String prompt, String apiKey) {
        // 1. Build the official Google GenAI Client dynamically with the BYOK key
        Client genAiClient = Client.builder()
                .apiKey(apiKey)
                .build();

        // 2. Set up the specific model options
        GoogleGenAiChatOptions options = GoogleGenAiChatOptions.builder()
                .model("gemini-2.5-flash-lite")
                .build();

        // 3. Build the Spring AI Chat Model wrapper
        GoogleGenAiChatModel chatModel = GoogleGenAiChatModel.builder()
                .genAiClient(genAiClient)
                .defaultOptions(options)
                .build();

        // 4. Call the model and return the generated explanation
        return chatModel.call(prompt);
    }
}

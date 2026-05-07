package mil.army.moda.qagenbackend.ai;

import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Component;

@Component
public class OpenAiProvider implements AiProvider { // Un-nested the class

    @Override
    public String getProviderName() {
        return "openai";
    }

    @Override
    public String generateExplanation(String prompt, String apiKey) {
        // BYOK: We instantiate the client dynamically using the user's specific key
        OpenAiApi openAiApi = new OpenAiApi(apiKey);
        OpenAiChatModel chatModel = new OpenAiChatModel(openAiApi);

        // Call the model and return the static explanation
        return chatModel.call(prompt);
    }
}

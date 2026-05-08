package mil.army.moda.qagenbackend.ai;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AiSwitchboardService {

    // Spring automatically injects every @Component that implements AiProvider here!
    private final List<AiProvider> providers;

    public AiSwitchboardService(List<AiProvider> providers) {
        this.providers = providers;
    }

    /**
     * Routes the AI request to the correct provider dynamically.
     *
     * @param prompt       The formatted question/context for the LLM.
     * @param providerName The name of the provider (e.g., "openai", "gemini").
     * @param apiKey       The user's specific API key for that provider.
     * @return The AI-generated explanation.
     */
    public String explain(String prompt, String providerName, String apiKey) {
        // 1. Find the matching provider based on the name from the frontend
        AiProvider selectedProvider = providers.stream()
                .filter(p -> p.getProviderName().equalsIgnoreCase(providerName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported AI Provider: " + providerName));

        // 2. Route the request to that specific implementation
        return selectedProvider.generateExplanation(prompt, apiKey);
    }
}
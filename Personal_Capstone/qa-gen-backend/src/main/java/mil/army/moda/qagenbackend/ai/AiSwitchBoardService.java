package mil.army.moda.qagenbackend.ai;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiSwitchBoardService {

    public class AiSwitchboardService {

        // Spring automatically finds all classes implementing AiProvider and adds them to this list!
        private final List<AiProvider> providers;

        public AiSwitchboardService(List<AiProvider> providers) {
            this.providers = providers;
        }

        /**
         * Routes the request to the appropriate AI Provider.
         */
        public String explain(String prompt, String providerName, String apiKey) {
            AiProvider selectedProvider = providers.stream()
                    .filter(p -> p.getProviderName().equalsIgnoreCase(providerName))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Unsupported AI Provider: " + providerName));

            return selectedProvider.generateExplanation(prompt, apiKey);
        }

    }

}

package mil.army.moda.qagenbackend.ai;

import mil.army.moda.qagenbackend.question.Question;
import mil.army.moda.qagenbackend.question.QuestionRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GeminiService {

    private final QuestionRepository questionRepository;
    private final RestTemplate restTemplate;

    // Gemini-2.5-flash-lite model
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=";

    public GeminiService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Core method to get an explanation. Uses the database as a cache.
     * REQUIRES the user's API key passed down from the Controller.
     */
    public String getExplanationForQuestion(UUID questionId, String userApiKey) {
        // 1. Fetch the exact question
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found."));

        // 2. THE CACHE CHECK: If an explanation already exists, return it instantly! (0 API Cost)
        if (question.getExplanation() != null && !question.getExplanation().isBlank()) {
            return question.getExplanation();
        }

        // 3. Security Check: If we reach here, we NEED an API key to continue
        if (userApiKey == null || userApiKey.isBlank()) {
            throw new IllegalArgumentException("API Key is required to generate a new explanation.");
        }

        // 4. Build the prompt specifically for this question
        String systemPrompt = """
            **Persona:**
            Act as an expert Tutor and Subject Matter Expert. Your primary objective is to deliver highly concise, direct, and accurate explanations for multiple-choice questions (MCQs). The goal is to enable a test-taker to rapidly understand precisely why the indicated correct answer is right and why each incorrect option is wrong. Prioritize extreme clarity and brevity for efficient learning and review.

            **Context:**
            You will be provided with a single multiple-choice question, its answer options, and the correct answer. Your task is to analyze this information and generate a focused explanation only for this specific question.

            **Output Structure & Formatting:**
            * **Essential Concept (Optional - Max 1 Sentence):** If a single core principle differentiates the answers.
            * **Answer Analysis:**
                * **Correct Answer:** Succinctly explain why this option is correct.
                * **Incorrect Answers:** For each incorrect option, briefly state why it is wrong.
            * **Key Term Definition(s) (Optional):** Briefly define crucial, unfamiliar technical terms.

            **Constraints & Rules:**
            * Extreme Conciseness & Directness: Get straight to the point. No introductory filler.
            * Mandatory Structure: Adhere strictly to the format above.
            * DO NOT restate the provided question.
            * DO NOT use conversational introductions like "Let's look at the options."

            ---
            **QUESTION TO ANALYZE:**
            Question: %s
            Options: %s
            Correct Answer(s): %s
            """;

        String formattedPrompt = String.format(
                systemPrompt,
                question.getQuestionText(),
                String.join("\n", question.getOptions()), // Joining with newlines looks cleaner for the AI
                String.join(", ", question.getCorrectAnswers())
        );

        // 5. Call the Gemini API
        String aiResponse = callGeminiApi(formattedPrompt, userApiKey);

        // 6. CACHE THE RESULT: Save it to the DB for the next user
        question.setExplanation(aiResponse);
        questionRepository.save(question);

        return aiResponse;
    }

    /**
     * Handles the specific JSON structure required by Google's Gemini REST API.
     */
    private String callGeminiApi(String prompt, String apiKey) {
        String fullUrl = GEMINI_API_URL + apiKey;

        // Gemini expects: { "contents": [{ "parts": [{"text": "your prompt"}] }] }
        Map<String, Object> requestBody =
                Map.of("contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            // Ask Spring to parse the response directly into a Jackson JsonNode tree
            JsonNode rootNode = restTemplate.postForObject(fullUrl, requestEntity, JsonNode.class);

            // Navigate the JSON tree safely without any type casting
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text").asString();

        } catch (Exception e) {
            System.err.println("Gemini API Call Failed: " + e.getMessage());
            throw new RuntimeException("Failed to generate AI explanation. Please check your API key and try again.");
        }
    }
}

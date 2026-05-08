package mil.army.moda.qagenbackend.ai;

import mil.army.moda.qagenbackend.question.Question;
import mil.army.moda.qagenbackend.question.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
public class AiController {

    private final AiSwitchboardService aiSwitchboardService;
    private final QuestionService questionService;

    public AiController(AiSwitchboardService aiSwitchboardService, QuestionService questionService) {
        this.aiSwitchboardService = aiSwitchboardService;
        this.questionService = questionService;
    }

    @GetMapping("/{id}/explain")
    public ResponseEntity<?> explainQuestion(
            @PathVariable UUID id,
            @RequestHeader(value = "X-AI-Provider", defaultValue = "gemini") String providerName,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey) {

        try {
            // 1. Fetch the exact question
            Question question = questionService.getQuestionById(id);

            // 2. THE CACHE CHECK: If an explanation already exists, return it instantly for API Cost!
            if (question.getExplanation() != null && !question.getExplanation().isBlank()) {
                return ResponseEntity.ok(Map.of("explanation", question.getExplanation()));
            }

            // 3. Security First: If we need a new explanation, we MUST have an API key
            if (apiKey == null || apiKey.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "API Key is missing. Please provide a valid API key in your settings."));
            }

            // 4. Build the prompt using your highly optimized prompt engineering
            String systemPrompt = """
                **Persona:**
                Act as an expert Tutor and Subject Matter Expert. Your primary objective is to deliver highly concise, direct, and accurate explanations for multiple-choice questions (MCQs). Prioritize extreme clarity and brevity for efficient learning and review.

                **Context:**
                You will be provided with a single multiple-choice question, its answer options, and the correct answer text. 

                **CRITICAL SHUFFLE RULE:** The options will be shuffled dynamically for the user. Therefore, you MUST NOT use letters (like A, B, C, D, etc.) or numbers (1, 2, steps, etc.) to refer to the options. You must refer to them using their EXACT TEXT.

                **Output Structure & Formatting:**
                * **Essential Concept (Optional - Max 1 Sentence):** If a single core principle differentiates the answers.
                * **Answer Analysis:**
                    * **Correct Answer - [Insert Exact Option Text Here]:** Succinctly explain why this option is correct.
                    * **Incorrect Answers:** For each incorrect option:
                        * **[Insert Exact Option Text Here]:** Briefly state why it is wrong.
                * **Key Term Definition(s) (Optional):** Briefly define crucial, unfamiliar technical terms.

                **Constraints & Rules:**
                * Extreme Conciseness & Directness: Get straight to the point. No introductory filler.
                * Mandatory Structure: Adhere strictly to the format above.
                * DO NOT restate the provided question.
                * DO NOT use letters (A, B, C, D) to reference options under any circumstances.

                ---
                **QUESTION TO ANALYZE:**
                Question: %s
                Options: %s
                Correct Answer(s): %s
                """;

            String formattedPrompt = String.format(
                    systemPrompt,
                    question.getQuestionText(),
                    String.join("\n", question.getOptions()),
                    String.join(", ", question.getCorrectAnswers())
            );

            // 5. Hand off to the Switchboard to route to OpenAI, Gemini, etc.
            String explanation = aiSwitchboardService.explain(formattedPrompt, providerName, apiKey);

            // 6. CACHE THE RESULT: Save it to the DB for the next user
            question.setExplanation(explanation);
            questionService.saveQuestion(question);

            // 7. Return the successful explanation
            return ResponseEntity.ok(Map.of("explanation", explanation));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI Generation Failed: " + e.getMessage()));
        }
    }
}
package mil.army.moda.qagenbackend.ai;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Endpoint to generate or retrieve an AI explanation for a specific question.
     * Requires the user's API key passed via the "X-API-Key" HTTP header.
     */
    @GetMapping("/{id}/explain")
    public ResponseEntity<?> explainQuestion(
            @PathVariable UUID id,
            // Set false here so that Spring Boot doesn't automatically crash if the header is missing. We can a 401 unauthroized instead.
            @RequestHeader(value = "X-API-Key", required = false) String apiKey) {

        // 1. Security First: Validate the API key presence before hitting the database
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "API Key is missing. Please provide a valid Gemini API key in your settings."));
        }

        try {
            // 2. Hand off to the Service layer (which handles the DB Cache and Google API call)
            String explanation = geminiService.getExplanationForQuestion(id, apiKey);

            // 3. Return the successful explanation wrapped in a clean JSON object
            return ResponseEntity.ok(Map.of("explanation", explanation));

        } catch (IllegalArgumentException e) {
            // Catch validation errors (e.g., Question not found in DB)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Catch Google API errors or unexpected server faults (e.g., invalid key)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
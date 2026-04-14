package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.question.Question;
import mil.army.moda.qagenbackend.question.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// 1. Tells Spring: Window that returns JSON/Text
@RestController

// 2. Sets the base URL for every endpoint in this file
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final QuestionService questionService;

    public QuizController(QuizService quizService, QuestionService questionService) {
        this.quizService = quizService;
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<String> createQuiz(@RequestBody Map<String, Object> request) {
        // 1. Hand the payload to the Quiz (jsonPayload)
        String message = quizService.createQuiz(request);

        questionService.saveQuestions(request.get("questions"));

        // 2. Generating the proper HTTP status (201)
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllQuizzes() {
        List<Map<String, Object>> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
}

package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.question.Question;
import mil.army.moda.qagenbackend.question.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    // THE FIX: Updated the return type here from <Quiz> to <QuizResponseDTO>
    public ResponseEntity<QuizResponseDTO> createQuiz(@RequestBody CreateQuizRequestDTO request) {

        // 1. Build the Quiz entity
        Quiz newQuiz = new Quiz();
        newQuiz.setTitle(request.getTitle());
        UUID fakeUserId = UUID.fromString("11111111-1111-1111-1111-111111111111");

        // 2. Save the Quiz
        Quiz savedQuiz = quizService.createQuiz(newQuiz, fakeUserId);

        // 3. Convert QuestionDTOs -> Question Entities
        List<Question> secureQuestionsForDatabase = new ArrayList<>();

        if (request.getQuestions() != null) {
            for (int i = 0; i < request.getQuestions().size(); i++) {
                QuestionDTO dto = request.getQuestions().get(i);

                Question q = new Question();

                // Use the JS/TS engine's number from frontend parsing, OR fallback to i + 1
                // If the user doesn't properly format the list of questions, we're going to have the controller increment the questions for the user instead.
                if (dto.getQuestionNumber() != null) {
                    q.setQuestionNumber(dto.getQuestionNumber());
                } else {
                    q.setQuestionNumber(i + 1);
                }

                q.setQuestionText(dto.getText());
                q.setOptions(dto.getOptions());
                q.setCorrectAnswers(dto.getCorrectAnswers());

                secureQuestionsForDatabase.add(q);
            }
        }

        // 4. Hand the secure, database-ready entities to the Kitchen!
        questionService.saveQuestions(secureQuestionsForDatabase, savedQuiz.getId(), fakeUserId);

        // 5. Build the safe outbound DTO
        QuizResponseDTO responseDTO = new QuizResponseDTO();
        responseDTO.setId(savedQuiz.getId());

        /// Security fix, here we introduced htmlEscapse to prevent XSS against our DB
        responseDTO.setTitle(HtmlUtils.htmlEscape(savedQuiz.getTitle()));

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllQuizzes() {
        List<Map<String, Object>> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable UUID id){
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
}

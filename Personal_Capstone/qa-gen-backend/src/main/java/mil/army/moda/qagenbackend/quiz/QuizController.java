package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.dto.CreateQuizRequestDTO;
import mil.army.moda.qagenbackend.dto.QuestionDTO;
import mil.army.moda.qagenbackend.dto.QuizResponseDTO;
import mil.army.moda.qagenbackend.question.Question;
import mil.army.moda.qagenbackend.question.QuestionService;
import mil.army.moda.qagenbackend.user.User;
import mil.army.moda.qagenbackend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    public QuizController(QuizService quizService, QuestionService questionService, UserRepository userRepository) {
        this.quizService = quizService;
        this.questionService = questionService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<QuizResponseDTO> createQuiz(
            @RequestBody CreateQuizRequestDTO request,
            @AuthenticationPrincipal UserDetails springUser) {

        // Build the Quiz entity
        Quiz newQuiz = new Quiz();
        newQuiz.setTitle(request.getTitle());

        // Get the email from the Spring Security VIP Badge
        String userEmail = springUser.getUsername();

        // Fetch the real user from the DB to get their UUID
        User realUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UUID realUserID = realUser.getId();

        // Save the Quiz with real User ID
        Quiz savedQuiz = quizService.createQuiz(newQuiz, realUserID);

        // Convert QuestionDTOs -> Question Entities
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
        // Save questions to the database
        questionService.saveQuestions(secureQuestionsForDatabase, savedQuiz.getId(), realUserID);

        // 5. Build the safe outbound DTO
        QuizResponseDTO responseDTO = new QuizResponseDTO();
        responseDTO.setId(savedQuiz.getId());

        /// Security fix, here we introduced htmlEscape to prevent XSS against our DB
        responseDTO.setTitle(HtmlUtils.htmlEscape(savedQuiz.getTitle()));

        responseDTO.setLastScore(savedQuiz.getLastScore());

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

    @PutMapping("/{id}/score")
    public ResponseEntity<QuizResponseDTO> updateScore(
            @PathVariable UUID id,
            @RequestBody Map<String, Integer> request) {

        // 1. Extract the score from the incoming JSON
        Integer newScore = request.get("lastScore");

        // 2. Hand it to the Kitchen
        Quiz updatedQuiz = quizService.updateQuizScore(id, newScore);

        // 3. Pack the safe Response DTO
        QuizResponseDTO responseDTO = new QuizResponseDTO();
        responseDTO.setId(updatedQuiz.getId());
        responseDTO.setTitle(HtmlUtils.htmlEscape(updatedQuiz.getTitle()));
        responseDTO.setLastScore(updatedQuiz.getLastScore());

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable UUID id) {

        // Hand ID over to be deleted
        quizService.deleteQuiz(id);

        // Return 204 no content status
        return ResponseEntity.noContent().build();
    }


}

package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.user.User;
import mil.army.moda.qagenbackend.user.UserRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QuizService {

    // Once this variable is assigned a value, it won't be reassigned to point to anything else.
    // This handles the event when many users may be wanting to access the application at once.
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    // Creating a new Quiz and attaching it to the specific User.
    public Quiz createQuiz(Quiz newQuiz, UUID userID){

        User creator = userRepository.findById(userID).orElseThrow(() -> new IllegalArgumentException("Cannot create quiz: User ID not found"));

        newQuiz.setUser(creator);

        return quizRepository.save(newQuiz);
    }

    public Quiz getQuizById(UUID targetQuizId){
        return quizRepository.findById(targetQuizId).orElseThrow(() -> new IllegalArgumentException("Quiz not found."));
    }

    // Fetch all quizzes belonging to a specific user
    public List<Quiz> getAllQuizzes(UUID userId) {
        return quizRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    /**
     * Updates the last score of a specific quiz.
     */
    public Quiz updateQuizScore(UUID quizId, Integer newScore) {
        // 1. Fetch the existing quiz from the database.
        // If it doesn't exist, throw an exception so the controller knows it failed.
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot update score: Quiz not found."));

        // 2. Update the score field
        existingQuiz.setLastScore(newScore);

        // 3. Save the updated entity back to the database.
        return quizRepository.save(existingQuiz);
    }

    public void deleteQuiz(UUID id){

    }
}

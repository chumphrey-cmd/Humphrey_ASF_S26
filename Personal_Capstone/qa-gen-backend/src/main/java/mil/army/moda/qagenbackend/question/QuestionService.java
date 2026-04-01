package mil.army.moda.qagenbackend.question;

import mil.army.moda.qagenbackend.quiz.Quiz;
import mil.army.moda.qagenbackend.quiz.QuizRepository;
import mil.army.moda.qagenbackend.user.User;
import mil.army.moda.qagenbackend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public QuestionService(QuestionRepository questionRepository, QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    public List<Question> saveQuestions(List<Question> incomingQuestions, UUID quizId, UUID userId){

        // Checks if the list is empty or null and returns an empty list!
        if (incomingQuestions == null || incomingQuestions.isEmpty()){
            return new ArrayList<>();
        }

        // Does the Quiz exist??
        Quiz targetQuiz = quizRepository.findById(quizId).orElseThrow(() -> new IllegalArgumentException("Quiz not found."));


    }
}

package mil.army.moda.qagenbackend.question;

import mil.army.moda.qagenbackend.quiz.Quiz;
import mil.army.moda.qagenbackend.quiz.QuizRepository;
import mil.army.moda.qagenbackend.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.swing.text.html.Option;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuestionService questionService;

    @Test
    public void shouldSaveValidQuestionsWhenUserOwnsQuiz(){

        // Arrange - Create user, quiz and UUIDs
        UUID userId = UUID.randomUUID();
        UUID quizId = UUID.randomUUID();

        User owner = new User();
        owner.setId(userId);

        Quiz targetQuiz = new Quiz();
        targetQuiz.setId(quizId);
        targetQuiz.setUser(owner); // Ensuring that we are tying the target quiz to the owner.

        // Arrange - Create 3 formatted correctly, here I wanted to simulate a series of questions being saved as a list
        Question q1 = createValidQuestion("Capital of Texas?", "Austin");
        Question q2 = createValidQuestion("2 + 2", "4");
        Question q3 = createValidQuestion("Color of the sky?", "Blue");
        List<Question> incomingQuestions = Arrays.asList(q1, q2, q3);

        // Arrange setting up Mockito
        // return the dummy quiz when search by its ID
        when(quizRepository.findById(quizId)).thenReturn(Optional.of(targetQuiz));

        // Arrange
        // save question and echo it back
        when(quizRepository.save(any(Quiz.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act - call the list we are building
        List<Question> savedQuestions = questionService.saveQuestions(incomingQuestions, quizId, userId);

        // Assert
        // Verify the size of the questions (3), that every question was attached to the correct quiz, and that it was called 3 times
        assertThat(savedQuestions).hasSize(3);
        assertThat(savedQuestions.get(0).getQuiz()).isEqualTo(targetQuiz);
        verify(questionRepository, times(3)).save(any(Question.class));
    }

    private Question createValidQuestion(String text, String answer){
        Question q = new Question();
        q.setQuestionText(text);
        q.setOptions(Arrays.asList(answer, "Wrong Option 1", "Wrong Option 2"));
        q.setCorrectAnswers(Arrays.asList(answer));
        return q;
    }
}

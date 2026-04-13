package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.question.QuestionService;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuizController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypasses Spring Security for testing
public class QuizControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private QuizService quizService;

    @MockitoBean
    private QuestionService questionService;

    @Test
    public void shouldReturn201WhenQuizIsSuccessfullyCreated() throws Exception {

        // 1. Arrange: Create the JSON Request
        // (Hint: Use a Map.of(...) where "title" is a String, and "questions" is a List.of(...) containing more Maps!)
        Map<String, Object> createQuizRequest = Map.of(
                "title", "Java Basics Quiz",
                "questions", List.of(
                        Map.of("text", "What is a String?", "answer", "Text data"),
                        Map.of("text", "What is an int?", "answer", "Number data")
                )
        );

        String jsonPayload = objectMapper.writeValueAsString(createQuizRequest);

        // 2. Arrange: Tell the Mock QuizService to return a success message or an ID
        when(quizService.createQuiz(any())).thenReturn("Quiz created with ID: 1");

        // 3. Act: Send a POST request to "/api/quizzes" with the JSON payload
        // (Hint: Remember your .characterEncoding("utf-8") and .contentType(...) )
        // 4. Assert: Expect a 201 Created status, the success message, and print the logs
        mockMvc.perform(post("/api/quizzes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(jsonPayload))
                .andExpect(status().isCreated()) // Expecting 201 Created
                .andExpect(content().string("Quiz created with ID: 1"))
                .andDo(print());

        // Sanity check to verify that the set of questions are actually saved - very basic implementation!
        verify(questionService, times(1)).saveQuestions(any());
    }
}
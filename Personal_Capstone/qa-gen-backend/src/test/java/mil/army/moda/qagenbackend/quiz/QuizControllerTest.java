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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.matchesPattern;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    @Test
    public void shouldReturn200AndListOfQuizzesWhenGetAllIsCalled() throws Exception {

        // 1. Arrange: Create a fake list of quizzes that the database "found"
        // (Hint: Use a List containing two Maps. E.g., Map.of("id", 1, "title", "Java Basics") )
        // Convert that list into a JSON string using objectMapper so we can check it later
        Map<String, Object> quizRequest1 =  Map.of(
                "title", "Java Basics Quiz",
                "questions", List.of(
                        Map.of("text", "What is a String?", "answer", "Text data"),
                        Map.of("text", "What is an int?", "answer", "Number data")
                )
        );

        Map<String, Object> quizRequest2 = Map.of(
                "title", "More Java Basics Quiz",
                "questions", List.of(
                        Map.of("text", "What is a bool?", "answer", "true or false data"),
                        Map.of("text", "What is an double?", "answer", "Number data with decimal")
                )
        );

        // Put both Quiz 1 and 2 into a single List (representing a JSON string being requested from the frontend)
        List<Map<String, Object>> allQuizzes = List.of(quizRequest1, quizRequest2);

        // Translating the entire list into a singe JSON Array string
        String expectedJsonArray = objectMapper.writeValueAsString(allQuizzes);

        // 2. Arrange: Tell the Mock QuizService to return the fake list when asked
        // (Hint: when(quizService.getAllQuizzes()).thenReturn(fakeList); )
        when(quizService.getAllQuizzes()).thenReturn(allQuizzes);

        // 3. Act: Send a GET request to "/api/quizzes"
        // 4. Assert: Expect a 200 OK status, check that the content matches your JSON string, and print the logs
        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk()) // Expecting 200 Created
                .andExpect(content().json(expectedJsonArray))
                .andDo(print());

        /// NOTE: Sanity check (verify) is not needed here. For a GET request, the QuizService handles fetching the quizzes and their questions from the database in one big swoop. The Controller doesn't need to talk to the QuestionService at all
    }

}
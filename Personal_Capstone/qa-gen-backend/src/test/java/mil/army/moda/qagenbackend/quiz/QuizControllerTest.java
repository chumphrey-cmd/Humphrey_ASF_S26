package mil.army.moda.qagenbackend.quiz;

import mil.army.moda.qagenbackend.config.JwtService;
import mil.army.moda.qagenbackend.question.QuestionService;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.matchesPattern;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuizController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypasses Spring Security for testing
public class QuizControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- SPRING SECURITY MOCKS ---
    // We must provide fake versions of these so the SecurityFilterChain can successfully boot up in our test context
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

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
                        Map.of(
                                "questionNumber", 1,
                                "text", "What is a String?",
                                "options", List.of("Text data", "Number data"),
                                "correctAnswers", List.of("Text data")
                        )
                )
        );
        String jsonPayload = objectMapper.writeValueAsString(createQuizRequest);

        // 2. Arrange: Create the mock Quiz entity the Service will return
        Quiz mockSavedQuiz = new Quiz();
        mockSavedQuiz.setId(UUID.randomUUID());
        mockSavedQuiz.setTitle("Java Basics Quiz");

        // Tell Mockito: "When the REAL quiz service is called, return this fake entity"
        when(quizService.createQuiz(any(Quiz.class), any(UUID.class))).thenReturn(mockSavedQuiz);

        // 3. Act & Assert: Send POST request and check the JSON response
        mockMvc.perform(post("/api/quizzes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Java Basics Quiz"))
                .andExpect(jsonPath("$.id").exists()) // Expect the safe DTO to contain an ID
                .andDo(print());

        // 4. Assert: Verify QuestionService was called with the correct 3 parameters!
        verify(questionService, times(1)).saveQuestions(anyList(), any(UUID.class), any(UUID.class));
    }

    @Test
    public void shouldReturn200AndListOfQuizzesWhenGetAllIsCalled() throws Exception {

        // 1. Arrange: Create a fake list of quizzes that the database "found"
        // (Hint: Use a List containing two Maps. E.g., Map.of("id", 1, "title", "Java Basics") )
        // Convert that list into a JSON string using objectMapper so we can check it later
        Map<String, Object> quizRequest1 = Map.of(
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
        when(quizService.getAllQuizzes()).thenReturn(allQuizzes);

        // 3. Act: Send a GET request to "/api/quizzes"
        // 4. Assert: Expect a 200 OK status, check that the content matches your JSON string, and print the logs
        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk()) // Expecting 200 Created
                .andExpect(content().json(expectedJsonArray))
                .andDo(print());

        /// NOTE: Sanity check (verify) is not needed here. For a GET request, the QuizService handles fetching the quizzes and their questions from the database in one big swoop. The Controller doesn't need to talk to the QuestionService at all
    }

    @Test
    public void shouldReturn200AndSingleQuizWhenGetByIdIsCalled() throws Exception {

        // 1. Arrange: Create the UUID and the fake quiz
        String fakeIdString = "123e4567-e89b-12d3-a456-426614174000";
        UUID testUuid = UUID.fromString(fakeIdString); // Converts the string to a strict Java UUID

        Quiz singleQuiz = new Quiz();
        singleQuiz.setId(testUuid);
        singleQuiz.setTitle("Java Basics Quiz");

        String expectedJson = objectMapper.writeValueAsString(singleQuiz);

        // 2. Arrange: Tell the Mock QuizService to return the fake quiz when asked for our exact UUID
        when(quizService.getQuizById(testUuid)).thenReturn(singleQuiz);

        // 3. Act: Send a GET request to the dynamic URL
        // 4. Assert: Expect a 200 OK status, check that the content matches expectedJson, and print the logs
        mockMvc.perform(get("/api/quizzes/" + fakeIdString))
                .andExpect(status().isOk()) // Expecting 200 OK
                .andExpect(content().json(expectedJson))
                .andDo(print());
    }

    @Test
    public void shouldReturn200AndUpdatedQuizWhenScoreIsUpdatedById() throws Exception {

        // 1. Arrange: The Setup
        String fakeIdString = "123e4567-e89b-12d3-a456-426614174000";
        UUID testUuid = UUID.fromString(fakeIdString);

        // Create the tiny JSON Request body (Hint: Map containing "score" -> 85)
        // 1. Arrange: Create the JSON Request
        Map<String, Integer> updateQuiz = Map.of(
                "lastScore", 85
        );

        // Translate that Map into a JSON string using objectMapper
        String jsonPayload = objectMapper.writeValueAsString(updateQuiz);


        // 2. Arrange: The Mock Entity
        // Create a real Quiz object, set its ID to testUuid, set Title, and set LastScore to 85.
        Quiz mockSavedQuiz = new Quiz();
        mockSavedQuiz.setId(testUuid);
        mockSavedQuiz.setTitle("Java Basics Quiz");
        mockSavedQuiz.setLastScore(85);

        // 3. Arrange: The Mockito Rule
        // (Note: We use eq() when mixing exact values with Mockito matchers!)
        when(quizService.updateQuizScore(eq(testUuid), eq(85))).thenReturn(mockSavedQuiz);

        // 4. Act: Send a PUT request
        // 5. Assert: Expect a 200 OK status, and check that $.lastScore is 85
        mockMvc.perform(put("/api/quizzes/" + fakeIdString + "/score")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(jsonPayload))
                .andExpect(status().isOk()) // 200 message
                .andExpect(jsonPath("$.title").value("Java Basics Quiz"))
                .andExpect(jsonPath("$.lastScore").value(85)) // Expect the safe DTO to contain an ID
                .andDo(print());
    }

    @Test
    public void shouldReturn204WhenQuizIsDeleted() throws Exception {

        // 1. Arrange: The Setup
        String fakeIdString = "123e4567-e89b-12d3-a456-426614174000";
        UUID testUuid = UUID.fromString(fakeIdString);


        // 2. Arrange: The Mockito Rule
        doNothing().when(quizService).deleteQuiz(testUuid);

        // 3. Act: Send a DELETE request
        // 4. Assert: Expect a 204 No Content status
        mockMvc.perform(delete("/api/quizzes/" + fakeIdString))
                .andExpect(status().isNoContent()) // 204 message
                .andDo(print());
    }
}
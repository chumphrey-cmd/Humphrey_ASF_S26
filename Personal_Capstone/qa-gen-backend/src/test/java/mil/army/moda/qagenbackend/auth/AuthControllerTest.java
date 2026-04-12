package mil.army.moda.qagenbackend.auth;

import mil.army.moda.qagenbackend.quiz.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.contentOf;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// 1. Tell Spring to ONLY boot up the web layer for the AuthController
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)// Normally Spring security blocks all unregistered post requests, but this temporarily pauses it since we're testing our backend.
public class AuthControllerTest {

    // 2. The Fake Customer (Drives up to the window to send HTTP requests)
    @Autowired
    private MockMvc mockMvc;

    // 3. The Fake Kitchen (Replaces @Mock. Tells Spring to put a fake service into the controller)
    @MockitoBean
    private AuthService authService; // (You might need to create this class if you haven't yet!)

    // 4. The Translator (Converts Java objects into clean JSON strings)
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldReturn201WhenRegistrationIsSuccessful() throws Exception {

        // 1. Arrange: Create a JSON request with a new email and password
        // Using a Map is a quick way to represent a JSON object: {"email": "...", "password": "..."}
        Map<String, String> registerRequest = Map.of(
                "email", "newuser@gmail.com",
                "password", "SecurePassword123!"
        );
        String jsonPayload = objectMapper.writeValueAsString(registerRequest);

        // 2. Arrange: Tell the Mock AuthService to return a success message
        // (Assuming our service returns a string message on success)
        when(authService.register(any())).thenReturn("User registered successfully");

        // 3 & 4. Act & Assert: Send the request and expect specific results!
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated()) // Expecting 201 Created
                .andExpect(content().string("User registered successfully"));
    }
}

// TEST 2: Registration Guardrail (Email in use)
// 1. Arrange: Create a JSON request with an email that already exists
// 2. Arrange: Tell the Mock AuthService to throw an exception saying "Email already in use"
// 3. Act: Send a POST request to /api/auth/register
// 4. Assert: Expect a 400 Bad Request status and the "Email already in use" message

// TEST 3: Login Happy Path
// 1. Arrange: Create a JSON request with valid credentials
// 2. Arrange: Tell the Mock AuthService to return a fake JWT string ("fake-jwt-token")
// 3. Act: Send a POST request to /api/auth/login
// 4. Assert: Expect a 200 OK status and the token in the response

// TEST 4: Login Guardrail (Vague Error Rule)
// 1. Arrange: Create a JSON request with bad credentials
// 2. Arrange: Tell the Mock AuthService to throw an exception
// 3. Act: Send a POST request to /api/auth/login
// 4. Assert: Expect a 401 Unauthorized status and the "Invalid email or password" message



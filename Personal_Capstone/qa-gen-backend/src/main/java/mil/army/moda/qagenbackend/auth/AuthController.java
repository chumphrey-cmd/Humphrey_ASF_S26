package mil.army.moda.qagenbackend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// 1. Tells Spring: Window that returns JSON/Text
@RestController

// 2. Sets the base URL for every endpoint in this file
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    // 3. Tells Spring: "If a POST request comes to /api/auth/register, route it here"
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> request) {

        // Hand the JSON payload to the Service
        String message = authService.register(request);

        // Package the Service's answer into an HTTP 201
        return  ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
}

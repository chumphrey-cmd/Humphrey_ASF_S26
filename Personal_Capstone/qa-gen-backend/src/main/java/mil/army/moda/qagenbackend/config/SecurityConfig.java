package mil.army.moda.qagenbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
// @EnableWebSecurity tells Spring Boot to apply this configuration to the global web security.
@EnableWebSecurity
public class SecurityConfig {

    // @Bean tells Spring: Create one instance of this object and keep so that whenever any class (like UserService) asks for a PasswordEncoder, use this.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * The SecurityFilterChain is the core gatekeeper of our application.
     * Every incoming HTTP request must pass through these rules before reaching our Controllers.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS Configuration (Allows React running on port 5173 to communicate with Spring Boot on 8080)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF (Cross-Site Request Forgery)
                // CSRF protection is for session-based apps. Since we are using stateless JWTs, we must disable it.
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Enforce Stateless Session Management
                // Tells Spring NOT to create HTTP Sessions to track users, enforcing our decoupled architecture.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Route Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC ROUTES: Make registration and login open to everyone
                        .requestMatchers("/api/auth/**").permitAll()

                        // PROTECTED ROUTES: Secure all quiz and chat proxy endpoints
                        .requestMatchers("/api/quizzes/**").authenticated()
                        .requestMatchers("/api/chat/**").authenticated() // Protecting your LLM Proxy!

                        // FALLBACK: Any other request not explicitly mentioned must also be authenticated
                        .anyRequest().authenticated()
                );

        // Note: We will inject our custom JwtAuthenticationFilter into this chain in Phase 4!

        return http.build();
    }

    /**
     * CORS configuration specifically tailored for our decoupled React/Vite frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Explicitly allow requests from the local Vite React development server
        /// NOTE: This is the ONLY place in your Java code where you define that frontend origin.
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Standard HTTP methods required for a full CRUD REST API
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // We MUST explicitly allow the "Authorization" header so our JWTs can pass through,
        // and "Content-Type" so our JSON payloads aren't blocked.
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Allow credentials (like cookies or authorization headers) to be sent cross-origin
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this exact CORS policy to ALL backend routes ("/**")
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
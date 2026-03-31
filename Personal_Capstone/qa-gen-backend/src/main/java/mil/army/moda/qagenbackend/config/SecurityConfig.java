package mil.army.moda.qagenbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration tells Spring: "Read this file when the app starts up to configure my settings."
@Configuration
public class SecurityConfig {

    // @Bean tells Spring: Create one instance of this object and keep so that whenever any class (like UserService) asks for a PasswordEncoder, use this.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

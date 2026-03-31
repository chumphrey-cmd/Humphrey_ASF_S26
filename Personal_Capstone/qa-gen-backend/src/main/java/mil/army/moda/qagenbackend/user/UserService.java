package mil.army.moda.qagenbackend.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Spring Boot automatically injects the Repository and PasswordEncoder here
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user and handles business rules like hashing the password before saving.
     */
    public User registerUser(User newUser) {

        // 1. Check if the email already exists
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // 2. Hash the password: take the plain text password, encode it, and set it back on the user object
        String plainTextPassword = newUser.getPasswordHash();
        String hashedPassword = passwordEncoder.encode(plainTextPassword);
        newUser.setPasswordHash(hashedPassword);

        // 3. Ensure all new users get the standard role
        newUser.setRole("USER");

        // 4. Save the fully prepped user to the database
        return userRepository.save(newUser);
    }
}

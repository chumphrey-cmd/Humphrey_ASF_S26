package mil.army.moda.qagenbackend.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// This tells JUnit to use Mockito's tools for this test class
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    // @Mock creates a fake, completely empty version of our repository.
    // It won't connect to a database; it just pretends to be the repository.
    @Mock
    private UserRepository userRepository;

    // Mocking PasswordEncoder so we don't have to load Spring Security yet, the goal here is to use BCrypt to hashing the password.
    @Mock
    private PasswordEncoder passwordEncoder;

    // @InjectMocks creates our REAL UserService, but it injects the fake @Mock objects we created above into it
    @InjectMocks
    private UserService userService;

    @Test
    public void shouldRegisterNewUserAndHashPassword() {
        // 1. Arrange: Create our raw input
        User newUser = new User();
        newUser.setEmail("newuser@gmail.com");
        newUser.setPasswordHash("MySecretPassword123!");

        // 2. Arrange: tell our mocked repo to look for anyone asking to find an email, return an empty result (meaning the email is available).
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // We tell our fake encoder: "If anyone asks to encode a password, just return 'hashed_version'."
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_version");

        // We tell our fake repo: if anyone asks to save a user, just return that exact same user.
        // invocation: is Mockito's word for the method call that just happened.
        // getArgument(0): grab the very first parameter that was passed into that method call.
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 3. Act: Call the method we are about to build
        User savedUser = userService.registerUser(newUser);

        // 4. Assert: Check the results
        assertThat(savedUser.getEmail()).isEqualTo("newuser@gmail.com");

        // VERY IMPORTANT here we ensure that the password was actually changed to the hashed version!
        assertThat(savedUser.getPasswordHash()).isEqualTo("hashed_version");

        // Verify that the save method was actually triggered exactly once
        verify(userRepository).save(any(User.class));
    }
}

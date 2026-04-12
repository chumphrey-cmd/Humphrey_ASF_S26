package mil.army.moda.qagenbackend.auth;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AuthService {
    public String register(Map<String, String> request){
        return "User registered successfully";
    }
}

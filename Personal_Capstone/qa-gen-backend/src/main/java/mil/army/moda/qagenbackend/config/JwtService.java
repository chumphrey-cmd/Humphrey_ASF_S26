package mil.army.moda.qagenbackend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * STUB PHASE (RED): All methods currently return null or false.
 * This guarantees our tests will fail first, proving that our tests actually work
 * before we write the real logic.
 */
@Service
public class JwtService {

    // The secret key used to mathematically sign the token.
    @Value("${application.security.jwt.secret-key:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String secretKey;

    // Token lifespan updated to 15 minutes (900,000 milliseconds) for standard security best practices.
    @Value("${application.security.jwt.expiration:900000}")
    private long jwtExpiration;

    /**
     * Generates a standard JWT token for the provided user.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * The core builder. It sets the claims, the subject (email), the timestamps, and signs the whole package using our cryptographic key.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername()) // This is the email!
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256) // HS256 is the algorithm
                .compact();
    }

    /**
     * Reads the token and pulls out the "Subject" (which we defined as the username/email).
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * A generic helper method that can extract any specific piece of data from the token payload.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * The core reader. It cryptographically verifies the token using our secret key,
     * ensuring nobody tampered with the token while it was traveling over the internet.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Converts our raw hex string into a cryptographically secure SecretKey object.
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Verifies two things:
     * 1. The email inside the token matches the email of the UserDetails provided.
     * 2. The token has not passed its expiration time.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Helper method: Checks if the token's expiration timestamp is before the current clock time.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Helper method: Uses our existing extractClaim method to pull just the Expiration date from the payload.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
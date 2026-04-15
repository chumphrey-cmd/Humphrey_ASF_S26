package mil.army.moda.qagenbackend.quiz;
import java.util.UUID;

public class QuizResponseDTO {
    private UUID id;
    private String title;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
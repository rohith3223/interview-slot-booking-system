package com.interview.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(nullable = false)
    private Integer rating;

    @Enumerated(EnumType.STRING)
    private Decision decision;

    @Column(name = "feedback_type")
    private String feedbackType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Decision { SELECTED, REJECTED, ON_HOLD, NEXT_ROUND }

    public Feedback() {}

    public Long getId()                               { return id; }
    public void setId(Long id)                        { this.id = id; }
    public Interview getInterview()                   { return interview; }
    public void setInterview(Interview interview)     { this.interview = interview; }
    public User getInterviewer()                      { return interviewer; }
    public void setInterviewer(User interviewer)      { this.interviewer = interviewer; }
    public String getComments()                       { return comments; }
    public void setComments(String comments)          { this.comments = comments; }
    public Integer getRating()                        { return rating; }
    public void setRating(Integer rating)             { this.rating = rating; }
    public Decision getDecision()                     { return decision; }
    public void setDecision(Decision decision)        { this.decision = decision; }
    public String getFeedbackType()                   { return feedbackType; }
    public void setFeedbackType(String feedbackType)  { this.feedbackType = feedbackType; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
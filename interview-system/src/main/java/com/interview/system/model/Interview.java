package com.interview.system.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "interviews")
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    @JsonIgnoreProperties({"interviews", "hibernateLazyInitializer"})
    private InterviewSlot slot;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties({"password", "interviews", "slots", "hibernateLazyInitializer"})
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnoreProperties({"slots", "hibernateLazyInitializer"})
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "interview_mode")
    private String interviewMode;

    @Column(name = "mode_details", columnDefinition = "TEXT")
    private String modeDetails;

    @OneToOne(mappedBy = "interview", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"interview", "hibernateLazyInitializer"})
    private Feedback feedback;

    @PrePersist
    protected void onCreate() {
        bookedAt = LocalDateTime.now();
        if (status == null) status = InterviewStatus.SCHEDULED;
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum InterviewStatus { SCHEDULED, COMPLETED, CANCELLED, NO_SHOW }

    public Interview() {}

    public Long getId()                                   { return id; }
    public void setId(Long id)                            { this.id = id; }
    public InterviewSlot getSlot()                        { return slot; }
    public void setSlot(InterviewSlot slot)               { this.slot = slot; }
    public User getCandidate()                            { return candidate; }
    public void setCandidate(User candidate)              { this.candidate = candidate; }
    public Job getJob()                                   { return job; }
    public void setJob(Job job)                           { this.job = job; }
    public InterviewStatus getStatus()                    { return status; }
    public void setStatus(InterviewStatus status)         { this.status = status; }
    public LocalDateTime getBookedAt()                    { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt)       { this.bookedAt = bookedAt; }
    public LocalDateTime getUpdatedAt()                   { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)     { this.updatedAt = updatedAt; }
    public String getInterviewMode()                      { return interviewMode; }
    public void setInterviewMode(String interviewMode)    { this.interviewMode = interviewMode; }
    public String getModeDetails()                        { return modeDetails; }
    public void setModeDetails(String modeDetails)        { this.modeDetails = modeDetails; }
    public Feedback getFeedback()                         { return feedback; }
    public void setFeedback(Feedback feedback)            { this.feedback = feedback; }
}
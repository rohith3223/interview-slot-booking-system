package com.interview.system.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private InterviewSlot slot;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "interview", cascade = CascadeType.ALL)
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

    public Feedback getFeedback()                         { return feedback; }
    public void setFeedback(Feedback feedback)            { this.feedback = feedback; }
}
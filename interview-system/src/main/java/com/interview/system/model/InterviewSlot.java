package com.interview.system.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "interview_slots")
public class InterviewSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = SlotStatus.AVAILABLE;
    }

    public enum SlotStatus { AVAILABLE, BOOKED, CANCELLED, COMPLETED }

    public InterviewSlot() {}

    public Long getId()                               { return id; }
    public void setId(Long id)                        { this.id = id; }

    public Job getJob()                               { return job; }
    public void setJob(Job job)                       { this.job = job; }

    public User getInterviewer()                      { return interviewer; }
    public void setInterviewer(User interviewer)      { this.interviewer = interviewer; }

    public LocalDateTime getStartTime()               { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime()                 { return endTime; }
    public void setEndTime(LocalDateTime endTime)     { this.endTime = endTime; }

    public SlotStatus getStatus()                     { return status; }
    public void setStatus(SlotStatus status)          { this.status = status; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
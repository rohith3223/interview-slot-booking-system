package com.interview.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String department;
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InterviewSlot> slots;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = JobStatus.OPEN;
    }

    public enum JobStatus { OPEN, CLOSED, ON_HOLD }

    public Job() {}

    public Long getId()                               { return id; }
    public void setId(Long id)                        { this.id = id; }

    public String getTitle()                          { return title; }
    public void setTitle(String title)                { this.title = title; }

    public String getDescription()                    { return description; }
    public void setDescription(String description)    { this.description = description; }

    public String getDepartment()                     { return department; }
    public void setDepartment(String department)      { this.department = department; }

    public String getLocation()                       { return location; }
    public void setLocation(String location)          { this.location = location; }

    public JobStatus getStatus()                      { return status; }
    public void setStatus(JobStatus status)           { this.status = status; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<InterviewSlot> getSlots()             { return slots; }
    public void setSlots(List<InterviewSlot> slots)   { this.slots = slots; }
}
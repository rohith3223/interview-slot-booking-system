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

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // ✅ Max candidates allowed
    @Column(name = "max_candidates")
    private Integer maxCandidates;

    // ✅ Job expiry date
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    // ✅ Current booking count
    @Column(name = "booking_count")
    private Integer bookingCount = 0;

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
        if (bookingCount == null) bookingCount = 0;
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
    public String getAddress()                        { return address; }
    public void setAddress(String address)            { this.address = address; }
    public Integer getMaxCandidates()                 { return maxCandidates; }
    public void setMaxCandidates(Integer maxCandidates){ this.maxCandidates = maxCandidates; }
    public LocalDateTime getExpiryDate()              { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate){ this.expiryDate = expiryDate; }
    public Integer getBookingCount()                  { return bookingCount; }
    public void setBookingCount(Integer bookingCount) { this.bookingCount = bookingCount; }
    public JobStatus getStatus()                      { return status; }
    public void setStatus(JobStatus status)           { this.status = status; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<InterviewSlot> getSlots()             { return slots; }
    public void setSlots(List<InterviewSlot> slots)   { this.slots = slots; }
}
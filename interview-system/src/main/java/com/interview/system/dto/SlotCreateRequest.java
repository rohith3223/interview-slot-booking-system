package com.interview.system.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class SlotCreateRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Interviewer ID is required")
    private Long interviewerId;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    // ✅ New fields for Online/Offline mode
    private String interviewMode;

    private String modeDetails;

    public Long getJobId()                             { return jobId; }
    public void setJobId(Long jobId)                   { this.jobId = jobId; }
    public Long getInterviewerId()                     { return interviewerId; }
    public void setInterviewerId(Long interviewerId)   { this.interviewerId = interviewerId; }
    public LocalDateTime getStartTime()                { return startTime; }
    public void setStartTime(LocalDateTime startTime)  { this.startTime = startTime; }
    public LocalDateTime getEndTime()                  { return endTime; }
    public void setEndTime(LocalDateTime endTime)      { this.endTime = endTime; }
    public String getInterviewMode()                   { return interviewMode; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }
    public String getModeDetails()                     { return modeDetails; }
    public void setModeDetails(String modeDetails)     { this.modeDetails = modeDetails; }
}
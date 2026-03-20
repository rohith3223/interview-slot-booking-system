package com.interview.system.dto;

import jakarta.validation.constraints.NotNull;

public class SlotBookingRequest {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String interviewMode; // ONLINE or OFFLINE

    private String modeDetails;  // Meeting link or Venue address

    public Long getSlotId()                    { return slotId; }
    public void setSlotId(Long slotId)         { this.slotId = slotId; }

    public Long getJobId()                     { return jobId; }
    public void setJobId(Long jobId)           { this.jobId = jobId; }

    public String getInterviewMode()                       { return interviewMode; }
    public void setInterviewMode(String interviewMode)     { this.interviewMode = interviewMode; }

    public String getModeDetails()                         { return modeDetails; }
    public void setModeDetails(String modeDetails)         { this.modeDetails = modeDetails; }
}
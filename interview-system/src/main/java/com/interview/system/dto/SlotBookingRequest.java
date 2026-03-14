package com.interview.system.dto;

import jakarta.validation.constraints.NotNull;

public class SlotBookingRequest {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
}
package com.interview.system.controller;

import com.interview.system.dto.SlotCreateRequest;
import com.interview.system.model.InterviewSlot;
import com.interview.system.model.InterviewSlot.SlotStatus;
import com.interview.system.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @GetMapping
    public ResponseEntity<List<InterviewSlot>> getAll() {
        return ResponseEntity.ok(slotService.getAllSlots());
    }

    @GetMapping("/available")
    public ResponseEntity<List<InterviewSlot>> getAvailable() {
        return ResponseEntity.ok(slotService.getAvailableSlots());
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<InterviewSlot>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(slotService.getSlotsByJob(jobId));
    }

    @GetMapping("/interviewer/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','INTERVIEWER')")
    public ResponseEntity<List<InterviewSlot>> getByInterviewer(@PathVariable Long id) {
        return ResponseEntity.ok(slotService.getSlotsByInterviewer(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewSlot> getById(@PathVariable Long id) {
        return ResponseEntity.ok(slotService.getSlotById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR','INTERVIEWER')")
    public ResponseEntity<InterviewSlot> create(@Valid @RequestBody SlotCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(slotService.createSlot(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<InterviewSlot> updateStatus(@PathVariable Long id,
                                                      @RequestParam SlotStatus status) {
        return ResponseEntity.ok(slotService.updateSlotStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        slotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
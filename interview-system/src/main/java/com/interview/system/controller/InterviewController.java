package com.interview.system.controller;

import com.interview.system.dto.FeedbackRequest;
import com.interview.system.dto.SlotBookingRequest;
import com.interview.system.model.Feedback;
import com.interview.system.model.Interview;
import com.interview.system.model.User;
import com.interview.system.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<Interview>> getAll() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @GetMapping("/candidate/{id}")
    public ResponseEntity<List<Interview>> getByCandidate(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getByCandidate(id));
    }

    @GetMapping("/job/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<Interview>> getByJob(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getByJob(id));
    }

    @GetMapping("/interviewer/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','INTERVIEWER')")
    public ResponseEntity<List<Interview>> getByInterviewer(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getByInterviewer(id));
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Interview> book(@Valid @RequestBody SlotBookingRequest request,
                                          @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interviewService.bookSlot(request, currentUser.getId()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Interview> cancel(@PathVariable Long id,
                                            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(interviewService.cancelInterview(id, currentUser.getId()));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN','HR','INTERVIEWER')")
    public ResponseEntity<Interview> complete(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.completeInterview(id));
    }

    @PostMapping("/feedback")
    @PreAuthorize("hasRole('INTERVIEWER')")
    public ResponseEntity<Feedback> feedback(@Valid @RequestBody FeedbackRequest request,
                                             @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interviewService.submitFeedback(request, currentUser.getId()));
    }
}
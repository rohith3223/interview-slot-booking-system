package com.interview.system.controller;

import com.interview.system.model.Interview;
import com.interview.system.model.Interview.InterviewStatus;
import com.interview.system.repository.InterviewRepository;
import com.interview.system.repository.JobRepository;
import com.interview.system.repository.SlotRepository;
import com.interview.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('ADMIN','HR')")
public class ReportController {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalJobs",           jobRepository.count());
        summary.put("totalSlots",          slotRepository.count());
        summary.put("totalInterviews",     interviewRepository.count());
        summary.put("totalUsers",          userRepository.count());
        summary.put("scheduledInterviews", interviewRepository.findByStatus(InterviewStatus.SCHEDULED).size());
        summary.put("completedInterviews", interviewRepository.findByStatus(InterviewStatus.COMPLETED).size());
        summary.put("cancelledInterviews", interviewRepository.findByStatus(InterviewStatus.CANCELLED).size());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-job/{jobId}")
    public ResponseEntity<List<Interview>> byJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(interviewRepository.findByJobId(jobId));
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<Interview>> byStatus(@PathVariable InterviewStatus status) {
        return ResponseEntity.ok(interviewRepository.findByStatus(status));
    }

    @GetMapping("/interviewer/{id}")
    public ResponseEntity<Map<String, Object>> interviewerReport(@PathVariable Long id) {
        List<Interview> list = interviewRepository.findBySlotInterviewerId(id);
        Map<String, Object> report = new HashMap<>();
        report.put("interviewerId", id);
        report.put("total",      list.size());
        report.put("scheduled",  list.stream().filter(i -> i.getStatus() == InterviewStatus.SCHEDULED).count());
        report.put("completed",  list.stream().filter(i -> i.getStatus() == InterviewStatus.COMPLETED).count());
        report.put("cancelled",  list.stream().filter(i -> i.getStatus() == InterviewStatus.CANCELLED).count());
        report.put("interviews", list);
        return ResponseEntity.ok(report);
    }
}

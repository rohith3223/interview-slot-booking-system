package com.interview.system.service;
import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.Interview;
import com.interview.system.model.Job;
import com.interview.system.model.Job.JobStatus;
import com.interview.system.repository.FeedbackRepository;
import com.interview.system.repository.InterviewRepository;
import com.interview.system.repository.JobRepository;
import com.interview.system.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private InterviewRepository interviewRepository;
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Job> getAllJobs() {
        LocalDateTime now = LocalDateTime.now();
        return jobRepository.findAll()
                .stream()
                .filter(job -> {
                    if (job.getExpiryDate() != null && job.getExpiryDate().isBefore(now)) {
                        return false;
                    }
                    if (job.getMaxCandidates() != null && job.getBookingCount() != null
                            && job.getBookingCount() >= job.getMaxCandidates()) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<Job> getAllJobsAdmin() {
        return jobRepository.findAll();
    }

    public List<Job> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
    }

    public Job createJob(Job job) {
        if (job.getBookingCount() == null) {
            job.setBookingCount(0);
        }
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updated) {
        Job existing = getJobById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDepartment(updated.getDepartment());
        existing.setLocation(updated.getLocation());
        existing.setStatus(updated.getStatus());
        existing.setAddress(updated.getAddress());
        existing.setMaxCandidates(updated.getMaxCandidates());
        existing.setExpiryDate(updated.getExpiryDate());
        return jobRepository.save(existing);
    }

    public void incrementBookingCount(Long jobId) {
        Job job = getJobById(jobId);
        int current = job.getBookingCount() == null ? 0 : job.getBookingCount();
        job.setBookingCount(current + 1);
        jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id))
            throw new ResourceNotFoundException("Job", id);

        // Step 1 — get all interviews for this job
        List<Interview> interviews = interviewRepository.findByJobId(id);

        // Step 2 — delete feedbacks first (feedbacks FK → interviews)
        for (Interview interview : interviews) {
            feedbackRepository.deleteByInterviewId(interview.getId());
        }

        // Step 3 — bulk delete all interviews for this job (interviews FK → slots)
        interviewRepository.deleteAllByJobId(id);

        // Step 4 — now safe to delete slots (no interviews reference them)
        slotRepository.deleteAllByJobId(id);

        // Step 5 — delete job
        jobRepository.deleteById(id);
    }
}
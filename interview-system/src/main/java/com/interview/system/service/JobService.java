package com.interview.system.service;

import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.Job;
import com.interview.system.model.Job.JobStatus;
import com.interview.system.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        LocalDateTime now = LocalDateTime.now();
        return jobRepository.findAll()
                .stream()
                .filter(job -> {
                    // ✅ Filter expired jobs
                    if (job.getExpiryDate() != null && job.getExpiryDate().isBefore(now)) {
                        return false;
                    }
                    // ✅ Filter full jobs
                    if (job.getMaxCandidates() != null && job.getBookingCount() != null
                            && job.getBookingCount() >= job.getMaxCandidates()) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<Job> getAllJobsAdmin() {
        // ✅ Admin sees ALL jobs including expired and full
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

    // ✅ Increment booking count when candidate books
    public void incrementBookingCount(Long jobId) {
        Job job = getJobById(jobId);
        int current = job.getBookingCount() == null ? 0 : job.getBookingCount();
        job.setBookingCount(current + 1);
        jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id))
            throw new ResourceNotFoundException("Job", id);
        jobRepository.deleteById(id);
    }
}
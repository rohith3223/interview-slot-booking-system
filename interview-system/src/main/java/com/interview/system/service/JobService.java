package com.interview.system.service;

import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.Job;
import com.interview.system.model.Job.JobStatus;
import com.interview.system.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
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
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updated) {
        Job existing = getJobById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDepartment(updated.getDepartment());
        existing.setLocation(updated.getLocation());
        existing.setStatus(updated.getStatus());
        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id))
            throw new ResourceNotFoundException("Job", id);
        jobRepository.deleteById(id);
    }
}
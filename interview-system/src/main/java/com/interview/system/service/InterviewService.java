package com.interview.system.service;

import com.interview.system.dto.FeedbackRequest;
import com.interview.system.dto.SlotBookingRequest;
import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.Feedback;
import com.interview.system.model.Interview;
import com.interview.system.model.Interview.InterviewStatus;
import com.interview.system.model.InterviewSlot;
import com.interview.system.model.InterviewSlot.SlotStatus;
import com.interview.system.model.Job;
import com.interview.system.model.User;
import com.interview.system.repository.FeedbackRepository;
import com.interview.system.repository.InterviewRepository;
import com.interview.system.repository.JobRepository;
import com.interview.system.repository.SlotRepository;
import com.interview.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private JobService jobService;

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public List<Interview> getByCandidate(Long id) {
        return interviewRepository.findByCandidateId(id);
    }

    public List<Interview> getByJob(Long id) {
        return interviewRepository.findByJobId(id);
    }

    public List<Interview> getByInterviewer(Long id) {
        return interviewRepository.findBySlotInterviewerId(id);
    }

    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", id));
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @Transactional
    public Interview bookSlot(SlotBookingRequest request, Long candidateId) {
        InterviewSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot", request.getSlotId()));

        if (slot.getStatus() != SlotStatus.AVAILABLE)
            throw new IllegalStateException("Slot is not available.");

        if (interviewRepository.existsBySlotIdAndCandidateId(request.getSlotId(), candidateId))
            throw new IllegalStateException("You have already booked this slot.");

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("User", candidateId));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", request.getJobId()));

        if (job.getMaxCandidates() != null && job.getBookingCount() != null
                && job.getBookingCount() >= job.getMaxCandidates()) {
            throw new IllegalStateException("This job has reached maximum candidates!");
        }

        if (job.getExpiryDate() != null
                && job.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalStateException("This job posting has expired!");
        }

        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        Interview interview = new Interview();
        interview.setSlot(slot);
        interview.setCandidate(candidate);
        interview.setJob(job);
        interview.setStatus(InterviewStatus.SCHEDULED);

        interview.setInterviewMode(slot.getInterviewMode() != null
                ? slot.getInterviewMode() : "ONLINE");
        interview.setModeDetails(slot.getModeDetails());

        Interview saved = interviewRepository.save(interview);

        jobService.incrementBookingCount(job.getId());

        return saved;
    }

    @Transactional
    public Interview cancelInterview(Long interviewId, Long requesterId) {
        Interview interview = getInterviewById(interviewId);
        if (interview.getStatus() == InterviewStatus.COMPLETED)
            throw new IllegalStateException("Cannot cancel a completed interview.");

        interview.setStatus(InterviewStatus.CANCELLED);
        interview.getSlot().setStatus(SlotStatus.AVAILABLE);
        slotRepository.save(interview.getSlot());
        return interviewRepository.save(interview);
    }

    @Transactional
    public Interview completeInterview(Long interviewId) {
        Interview interview = getInterviewById(interviewId);
        interview.setStatus(InterviewStatus.COMPLETED);
        interview.getSlot().setStatus(SlotStatus.COMPLETED);
        slotRepository.save(interview.getSlot());
        return interviewRepository.save(interview);
    }

    @Transactional
    public Feedback submitFeedback(FeedbackRequest request, Long userId) {
        Interview interview = getInterviewById(request.getInterviewId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        String feedbackType = request.getFeedbackType();

        if ("INTERVIEWER".equals(feedbackType)) {
            if (interview.getStatus() != InterviewStatus.COMPLETED)
                throw new IllegalStateException("Feedback only allowed for completed interviews.");

            if (interview.getFeedback() != null)
                throw new IllegalStateException("Feedback already submitted.");
        }

        if ("CANDIDATE".equals(feedbackType)) {
            if (interview.getStatus() != InterviewStatus.COMPLETED)
                throw new IllegalStateException("You can only give feedback after the interview is completed.");
        }

        Feedback feedback = new Feedback();
        feedback.setInterview(interview);
        feedback.setInterviewer(user);
        feedback.setComments(request.getComments());
        feedback.setRating(request.getRating());
        feedback.setFeedbackType(feedbackType);

        if ("INTERVIEWER".equals(feedbackType)) {
            feedback.setDecision(request.getDecision());
            interview.setFeedback(feedback);
            interviewRepository.save(interview);
        }

        return feedbackRepository.save(feedback);
    }
}
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

        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        Interview interview = new Interview();
        interview.setSlot(slot);
        interview.setCandidate(candidate);
        interview.setJob(job);
        interview.setStatus(InterviewStatus.SCHEDULED);

        return interviewRepository.save(interview);
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
    public Feedback submitFeedback(FeedbackRequest request, Long interviewerId) {
        Interview interview = getInterviewById(request.getInterviewId());

        if (interview.getStatus() != InterviewStatus.COMPLETED)
            throw new IllegalStateException("Feedback only allowed for completed interviews.");

        if (interview.getFeedback() != null)
            throw new IllegalStateException("Feedback already submitted.");

        User interviewer = userRepository.findById(interviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", interviewerId));

        Feedback feedback = new Feedback();
        feedback.setInterview(interview);
        feedback.setInterviewer(interviewer);
        feedback.setComments(request.getComments());
        feedback.setRating(request.getRating());
        feedback.setDecision(request.getDecision());

        interview.setFeedback(feedback);
        interviewRepository.save(interview);
        return feedback;
    }
}
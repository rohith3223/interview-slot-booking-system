package com.interview.system.service;

import com.interview.system.dto.SlotCreateRequest;
import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.InterviewSlot;
import com.interview.system.model.InterviewSlot.SlotStatus;
import com.interview.system.model.Job;
import com.interview.system.model.User;
import com.interview.system.repository.JobRepository;
import com.interview.system.repository.SlotRepository;
import com.interview.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public List<InterviewSlot> getAllSlots() {
        return slotRepository.findAll();
    }

    public List<InterviewSlot> getAvailableSlots() {
        return slotRepository.findByStatus(SlotStatus.AVAILABLE);
    }

    public List<InterviewSlot> getSlotsByJob(Long id) {
        return slotRepository.findByJobIdAndStatus(id, SlotStatus.AVAILABLE);
    }

    public List<InterviewSlot> getSlotsByInterviewer(Long id) {
        return slotRepository.findByInterviewerId(id);
    }

    public InterviewSlot getSlotById(Long id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slot", id));
    }

    @Transactional
    public InterviewSlot createSlot(SlotCreateRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", request.getJobId()));

        User interviewer = userRepository.findById(request.getInterviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getInterviewerId()));

        List<InterviewSlot> overlaps = slotRepository.findOverlappingSlots(
                request.getInterviewerId(),
                request.getStartTime(),
                request.getEndTime());

        if (!overlaps.isEmpty())
            throw new IllegalStateException("Interviewer already has a slot during this time.");

        InterviewSlot slot = new InterviewSlot();
        slot.setJob(job);
        slot.setInterviewer(interviewer);
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setStatus(SlotStatus.AVAILABLE);

        return slotRepository.save(slot);
    }

    @Transactional
    public InterviewSlot updateSlotStatus(Long id, SlotStatus status) {
        InterviewSlot slot = getSlotById(id);
        slot.setStatus(status);
        return slotRepository.save(slot);
    }

    @Transactional
    public void deleteSlot(Long id) {
        InterviewSlot slot = getSlotById(id);
        if (slot.getStatus() == SlotStatus.BOOKED)
            throw new IllegalStateException("Cannot delete a booked slot.");
        slotRepository.deleteById(id);
    }
}
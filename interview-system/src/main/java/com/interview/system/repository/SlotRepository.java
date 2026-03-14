package com.interview.system.repository;

import com.interview.system.model.InterviewSlot;
import com.interview.system.model.InterviewSlot.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<InterviewSlot, Long> {
    List<InterviewSlot> findByStatus(SlotStatus status);
    List<InterviewSlot> findByInterviewerId(Long interviewerId);
    List<InterviewSlot> findByJobId(Long jobId);
    List<InterviewSlot> findByJobIdAndStatus(Long jobId, SlotStatus status);

    @Query("SELECT s FROM InterviewSlot s WHERE s.interviewer.id = :interviewerId " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    List<InterviewSlot> findOverlappingSlots(
        @Param("interviewerId") Long interviewerId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}
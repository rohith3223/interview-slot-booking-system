package com.interview.system.repository;

import com.interview.system.model.Interview;
import com.interview.system.model.Interview.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateId(Long candidateId);
    List<Interview> findByJobId(Long jobId);
    List<Interview> findByStatus(InterviewStatus status);
    List<Interview> findBySlotInterviewerId(Long interviewerId);
    boolean existsBySlotIdAndCandidateId(Long slotId, Long candidateId);

    @Query("SELECT i FROM Interview i WHERE i.job.id = :jobId AND i.status = :status")
    List<Interview> findByJobIdAndStatus(
        @Param("jobId") Long jobId,
        @Param("status") InterviewStatus status
    );
}
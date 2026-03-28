package com.interview.system.repository;

import com.interview.system.model.Interview;
import com.interview.system.model.Interview.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateId(Long candidateId);
    List<Interview> findByJobId(Long jobId);
    List<Interview> findByStatus(InterviewStatus status);
    List<Interview> findBySlotInterviewerId(Long interviewerId);
    boolean existsBySlotIdAndCandidateId(Long slotId, Long candidateId);

    // ✅ Native SQL bulk delete — avoids JPQL cache issues and FK violations
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM interviews WHERE job_id = :jobId", nativeQuery = true)
    void deleteAllByJobId(@Param("jobId") Long jobId);

    // ✅ Also delete interviews linked via slot (covers cases where job_id may differ)
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM interviews WHERE slot_id IN (SELECT id FROM interview_slots WHERE job_id = :jobId)", nativeQuery = true)
    void deleteAllBySlotJobId(@Param("jobId") Long jobId);

    @Query("SELECT i FROM Interview i WHERE i.job.id = :jobId AND i.status = :status")
    List<Interview> findByJobIdAndStatus(
        @Param("jobId") Long jobId,
        @Param("status") InterviewStatus status
    );
}
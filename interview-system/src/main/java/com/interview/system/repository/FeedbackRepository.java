package com.interview.system.repository;

import com.interview.system.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByFeedbackType(String feedbackType);

    // ✅ @Transactional required on @Modifying queries
    @Transactional
    @Modifying
    @Query("DELETE FROM Feedback f WHERE f.interview.id = :interviewId")
    void deleteByInterviewId(@Param("interviewId") Long interviewId);
}
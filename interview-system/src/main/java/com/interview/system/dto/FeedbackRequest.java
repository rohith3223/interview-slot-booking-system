package com.interview.system.dto;

import com.interview.system.model.Feedback.Decision;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FeedbackRequest {

    @NotNull(message = "Interview ID is required")
    private Long interviewId;

    @NotBlank(message = "Comments are required")
    private String comments;

    @Min(1) @Max(5)
    @NotNull(message = "Rating is required")
    private Integer rating;

    private Decision decision;

    private String feedbackType;

    public Long getInterviewId()                  { return interviewId; }
    public void setInterviewId(Long interviewId)  { this.interviewId = interviewId; }
    public String getComments()                   { return comments; }
    public void setComments(String comments)      { this.comments = comments; }
    public Integer getRating()                    { return rating; }
    public void setRating(Integer rating)         { this.rating = rating; }
    public Decision getDecision()                 { return decision; }
    public void setDecision(Decision decision)    { this.decision = decision; }
    public String getFeedbackType()               { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }
}
package com.meetingsummarizer.meeting_summarizer.dto;

import com.meetingsummarizer.meeting_summarizer.model.Meeting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingResponse {
    private Long id;
    private String fileName;
    private String title;
    private String status;
    private String transcript;
    private String summary;
    private List<String> keyDecisions;
    private List<Meeting.ActionItem> actionItems;
    private String errorMessage;
    private LocalDateTime createdAt;

    public static MeetingResponse from(Meeting m) {
        return MeetingResponse.builder()
                .id(m.getId())
                .fileName(m.getFileName())
                .title(m.getTitle())
                .status(m.getStatus().name())
                .transcript(m.getTranscript())
                .summary(m.getSummary())
                .keyDecisions(m.getKeyDecisions())
                .actionItems(m.getActionItems())
                .errorMessage(m.getErrorMessage())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
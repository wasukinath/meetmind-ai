package com.meetingsummarizer.meeting_summarizer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SummaryResult {
    private String summary;
    private List<String> keyDecisions = new ArrayList<>();
    private List<ActionItemDto> actionItems = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ActionItemDto {
        private String task;
        private String owner;
        private String priority;
    }
}
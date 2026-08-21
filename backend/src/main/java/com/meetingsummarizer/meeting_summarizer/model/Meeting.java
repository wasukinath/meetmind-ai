package com.meetingsummarizer.meeting_summarizer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String title;

    @Enumerated(EnumType.STRING)
    private MeetingStatus status = MeetingStatus.PROCESSING;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String transcript;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String summary;

    @ElementCollection
    @CollectionTable(name = "meeting_key_decisions", joinColumns = @JoinColumn(name = "meeting_id"))
    @Column(name = "decision", columnDefinition = "CLOB")
    private List<String> keyDecisions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "meeting_action_items", joinColumns = @JoinColumn(name = "meeting_id"))
    private List<ActionItem> actionItems = new ArrayList<>();

    private String errorMessage;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionItem {
        private String task;
        private String owner;
        private String priority;
    }
}